import {
  CheckCircle2,
  Ellipsis,
  Gauge,
  Pencil,
  Plus,
  Share2,
  Timer,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSprintBoard } from "../../../hooks/useSprintBoard";
import { Avatar } from "../../../components/ui/Avatar";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Progress } from "../../../components/ui/Progress";
import { useToast } from "../../../components/ui/ToastProvider";
import { Select } from "../../../components/ui/Select";
import styles from "./SprintBoard.module.css";

function ColumnCard({
  card,
  columnId,
  onEdit,
  onDelete,
  onMoveWithin,
  onHoverWithin,
  onHoverLeave,
  dense,
}) {
  const tagClass = (t) => {
    if (/prioridad/i.test(t)) return styles.tagPrioridad;
    if (/seguridad/i.test(t)) return styles.tagSeguridad;
    if (/back/i.test(t)) return styles.tagBack;
    if (/front/i.test(t)) return styles.tagFront;
    if (/base de datos|datos|db/i.test(t)) return styles.tagDB;
    if (/diseñ|disen/i.test(t)) return styles.tagDesign;
    return styles.tagOther;
  };
  const orderedTags = Array.isArray(card.tags)
    ? [...card.tags].sort((a, b) => {
        const w = (t) =>
          /prioridad/i.test(t)
            ? 0
            : /seguridad/i.test(t)
            ? 1
            : /back/i.test(t)
            ? 2
            : /front/i.test(t)
            ? 3
            : 4;
        return w(a) - w(b);
      })
    : [];
  return (
    <div
      role="listitem"
      aria-label={`${card.id} - ${card.titulo}`}
      className={styles.card}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/card-id", card.id);
        e.dataTransfer.setData("text/from-col", columnId);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onHoverWithin?.(columnId, card.id);
      }}
      onDrop={(e) => {
        const draggedId = e.dataTransfer.getData("text/card-id");
        const fromCol = e.dataTransfer.getData("text/from-col");
        if (draggedId && fromCol === columnId && draggedId !== card.id) {
          onMoveWithin?.(columnId, draggedId, card.id);
        }
      }}
      onDragLeave={() => onHoverLeave?.()}
    >
      <div className={styles.cardTags}>
        {orderedTags.map((t) => (
          <span key={t} className={`${styles.tag} ${tagClass(t)}`}>
            {t}
          </span>
        ))}
      </div>
      <h4
        className={`${styles.cardTitle} ${dense ? styles.cardTitleDense : ""}`}
      >
        {card.id} - {card.titulo}
      </h4>
      <div className={styles.cardMeta}>
        <span className={styles.cardMetaLeft}>
          <CheckCircle2 size={16} /> {card.puntos} pts
          <span className="ml-2">
            <Avatar initials={card.owner} />
          </span>
        </span>
        <span className={styles.cardMetaRight}>
          <button
            className={styles.iconBtn}
            title="Editar"
            aria-label="Editar tarjeta"
            onClick={() => onEdit?.(columnId, card)}
          >
            <Pencil size={16} />
          </button>
          <button
            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
            title="Eliminar"
            aria-label="Eliminar tarjeta"
            onClick={() => onDelete?.(columnId, card)}
          >
            <Trash2 size={16} />
          </button>
        </span>
      </div>
      <div className={`${dense ? "" : ""}`}>
        {(() => {
          const hasChecklist = Array.isArray(card.checklist);
          const done = hasChecklist
            ? card.checklist.filter((i) => i.done).length
            : card.progreso?.done || 0;
          const total = hasChecklist
            ? card.checklist.length
            : card.progreso?.total || 1;
          return (
            <>
              <Progress
                value={done}
                max={total || 1}
                color="violet"
                className={dense ? styles.progressDense : styles.progress}
              />
              <div className={styles.progressInfo}>
                {done}/{hasChecklist ? total : card.progreso?.total ?? total}
              </div>
            </>
          );
        })()}
      </div>
      {card.fecha || (card.checklist && card.checklist.length > 0) ? (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>
            {card.fecha ? new Date(card.fecha).toLocaleDateString() : ""}
          </span>
          {Array.isArray(card.checklist) ? (
            <span>
              {card.checklist.filter((i) => i.done).length}/
              {card.checklist.length} checklist
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Column({
  column,
  members,
  onAdd,
  onMove,
  onEdit,
  onDelete,
  forceOpen = false,
  onOpened,
  filters,
  dense,
}) {
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [puntos, setPuntos] = useState("");
  const [tags, setTags] = useState("");
  const [owner, setOwner] = useState("");
  const [isOver, setIsOver] = useState(false);
  const [hoverTargetId, setHoverTargetId] = useState(null);
  const toast = useToast();
  const [quickTitle, setQuickTitle] = useState("");

  useEffect(() => {
    if (forceOpen) {
      setShowForm(true);
      onOpened && onOpened();
    }
  }, [forceOpen, onOpened]);

  function handleCreate() {
    if (!titulo.trim()) return;
    const id = `HU${Math.floor(Date.now() / 1000)
      .toString()
      .slice(-4)}`;
    const payload = {
      id,
      titulo: titulo.trim(),
      puntos: Number(puntos || 0),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      progreso: { done: 0, total: 17 },
      owner: owner || members?.[0]?.iniciales || "NA",
    };
    onAdd?.(column.id, payload);
    toast.success(
      "Se creó la tarjeta",
      `${id} — "${payload.titulo}" en ${column.titulo}`
    );
    setTitulo("");
    setPuntos("");
    setTags("");
    setOwner("");
    setShowForm(false);
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <div className={styles.columnHeader}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Reordenar columna"
            aria-label={`Reordenar columna ${column.titulo}`}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 cursor-grab focus-visible:outline-none"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/col-id", column.id);
            }}
          >
            ≡
          </button>
          <h3 className={styles.columnTitle}>{column.titulo}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={styles.columnCount}>
            {column.cards?.length ?? 0}
          </span>
          <button
            className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 whitespace-nowrap focus-visible:outline-none"
            aria-label="Opciones de columna"
            onClick={() =>
              setColOptions({ id: column.id, titulo: column.titulo })
            }
          >
            <Ellipsis size={18} />
          </button>
          <button
            title="Eliminar columna"
            aria-label={`Eliminar columna ${column.titulo}`}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-gray-300 hover:bg-rose-50 text-rose-700 focus-visible:outline-none"
            onClick={() =>
              onDelete?.("column", { id: column.id, titulo: column.titulo })
            }
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div
        role="list"
        aria-label={`Tarjetas en ${column.titulo}`}
        className={styles.columnList}
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
          // Auto-scroll vertical dentro de la columna durante drag
          const el = e.currentTarget;
          const rect = el.getBoundingClientRect();
          const threshold = 60;
          if (e.clientY - rect.top < threshold) {
            el.scrollTop -= 20;
          } else if (rect.bottom - e.clientY < threshold) {
            el.scrollTop += 20;
          }
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.stopPropagation();
          const cardId = e.dataTransfer.getData("text/card-id");
          const fromCol = e.dataTransfer.getData("text/from-col");
          setIsOver(false);
          if (cardId && fromCol && fromCol !== column.id) {
            onMove?.between?.(fromCol, column.id, cardId);
          }
        }}
      >
        {/* Quick Add */}
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && quickTitle.trim()) {
              const newId = `HU${Date.now().toString().slice(-4)}`;
              onAdd?.(column.id, {
                id: newId,
                titulo: quickTitle.trim(),
                puntos: 0,
                tags: [],
                progreso: { done: 0, total: 17 },
              });
              setQuickTitle("");
              toast.success(
                "Se creó la tarjeta",
                `${newId} — "${quickTitle.trim()}" en ${column.titulo}`
              );
            }
          }}
          placeholder="Añadir tarjeta rápida y presiona Enter"
          className={styles.quickInput}
        />
        {showForm && (
          <div className={styles.form}>
            <div className="space-y-3">
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la tarjeta"
                className={styles.formInput}
              />
              <div className={styles.formRow}>
                <input
                  type="number"
                  min="0"
                  value={puntos}
                  onChange={(e) => setPuntos(e.target.value)}
                  placeholder="Puntos"
                  className={`${styles.formInput} ${styles.formNumber}`}
                />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags (coma separada)"
                  className={`${styles.formInput}`}
                />
                <Select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="">Asignar</option>
                  {members?.map((m) => (
                    <option key={m.id} value={m.iniciales}>
                      {m.iniciales}
                    </option>
                  ))}
                </Select>
              </div>
              <div className={styles.formRow}>
                <Button
                  onClick={handleCreate}
                  className={`h-9 px-3 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600`}
                >
                  Crear
                </Button>
                <Button
                  variant="light"
                  onClick={() => setShowForm(false)}
                  className={`h-9 px-3 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600`}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Placeholder de posición */}
        {column.cards
          .filter((c) => {
            if (!filters) return true;
            const textOk =
              !filters.q || (c.titulo || "").toLowerCase().includes(filters.q);
            const ownerOk = !filters.owner || c.owner === filters.owner;
            const tagOk =
              !filters.tag ||
              (Array.isArray(c.tags) &&
                c.tags.some((t) => t.toLowerCase() === filters.tag));
            return textOk && ownerOk && tagOk;
          })
          .map((c) => (
            <div key={c.id + c.titulo}>
              {hoverTargetId === c.id ? (
                <div className={styles.placeholder} />
              ) : null}
              <ColumnCard
                card={c}
                columnId={column.id}
                onEdit={onEdit}
                onDelete={onDelete}
                onMoveWithin={onMove?.within}
                onHoverWithin={(_, __) => setHoverTargetId(c.id)}
                onHoverLeave={() => setHoverTargetId(null)}
                dense={dense}
              />
            </div>
          ))}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.addCardBtn}
          >
            <Plus size={18} /> Añadir Tarjeta
          </button>
        )}
      </div>
    </div>
  );
}

function EditForm({ card, members, presetLabels, onSave, onCancel }) {
  const [titulo, setTitulo] = useState(card.titulo || "");
  const [puntos, setPuntos] = useState(card.puntos || 0);
  const [owner, setOwner] = useState(
    card.owner || members?.[0]?.iniciales || "NA"
  );
  const [tags, setTags] = useState(Array.isArray(card.tags) ? card.tags : []);
  const [fecha, setFecha] = useState(
    card.fecha ? card.fecha.substring(0, 10) : ""
  );
  const [checklist, setChecklist] = useState(
    Array.isArray(card.checklist) ? card.checklist : []
  );
  const [newItem, setNewItem] = useState("");
  const [newTag, setNewTag] = useState("");
  const toast = useToast();

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }
  function addItem() {
    const t = newItem.trim();
    if (!t) return;
    setChecklist((prev) => [
      ...prev,
      { id: "i" + Date.now(), text: t, done: false },
    ]);
    setNewItem("");
    toast.success("Item agregado", t);
  }
  function toggleItem(id) {
    setChecklist((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );
  }
  function removeItem(id) {
    setChecklist((prev) => prev.filter((i) => i.id !== id));
  }
  function addTag() {
    const t = newTag.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((prev) => [...prev, t]);
    setNewTag("");
    toast.success("Etiqueta agregada", t);
  }
  function removeTag(t) {
    setTags((prev) => prev.filter((x) => x !== t));
  }

  return (
    <div className={styles.editForm}>
      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Título</label>
        <input
          className={styles.editInput}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>
      <div className={styles.twoCols}>
        <div className={styles.editGroup}>
          <label className={styles.editLabel}>Puntos</label>
          <input
            type="number"
            min="0"
            className={styles.editInput}
            value={puntos}
            onChange={(e) => setPuntos(Number(e.target.value || 0))}
          />
        </div>
        <div className={styles.editGroup}>
          <label className={styles.editLabel}>Responsable</label>
          <select
            className={styles.editSelect}
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          >
            {members?.map((m) => (
              <option key={m.id} value={m.iniciales}>
                {m.iniciales}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Etiquetas</label>
        <div className={styles.chipRow}>
          {presetLabels.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`${styles.chip} ${
                tags.includes(t) ? styles.chipActive : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={styles.tagEditorRow}>
          <input
            className={styles.tagInput}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nueva etiqueta"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button className={styles.tagAddBtn} onClick={addTag}>
            Añadir
          </Button>
        </div>
        {tags.length > 0 && (
          <div className={styles.tagList}>
            {tags.map((t) => (
              <span key={t} className={styles.tagItem}>
                {t}
                <button
                  type="button"
                  className={styles.tagRemove}
                  aria-label={`Quitar ${t}`}
                  onClick={() => removeTag(t)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Fecha</label>
        <input
          type="date"
          className={styles.editInput}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>
      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Checklist</label>
        <div className={styles.checkList}>
          {checklist.map((i) => (
            <div key={i.id} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={!!i.done}
                onChange={() => toggleItem(i.id)}
              />
              <span
                className={`${styles.checkText} ${
                  i.done ? styles.checkTextDone : ""
                }`}
              >
                {i.text}
              </span>
              <button
                className="ml-auto text-xs text-rose-600 hover:underline"
                onClick={() => removeItem(i.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
          <div className={styles.newItemRow}>
            <input
              className={styles.editInput}
              style={{ flex: 1 }}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Nueva tarea"
            />
            <Button className="h-9 px-3" onClick={addItem}>
              Añadir
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.editFooter}>
        <Button variant="light" className="h-9 px-4" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          className="h-9 px-4"
          onClick={() =>
            onSave({ titulo, puntos, owner, tags, fecha, checklist })
          }
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}

export function SprintBoard() {
  const {
    loading,
    stats,
    columns,
    members,
    addCard,
    moveCard,
    moveCardWithin,
    updateCard,
    deleteCard,
    addColumn,
    renameColumn,
    deleteColumn,
    moveColumn,
  } = useSprintBoard();
  const [openColumnId, setOpenColumnId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confirmDlg, setConfirmDlg] = useState(null);
  const scrollerRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const toast = useToast();
  const colRefs = useRef({});
  const [colOptions, setColOptions] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const presetLabels = [
    "Prioridad Alta",
    "Back-End",
    "Front-End",
    "Seguridad",
    "Base de Datos",
    "Diseño",
  ];
  const [q, setQ] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const dense = useMemo(() => {
    try {
      const longest = Math.max(
        0,
        ...[
          ...(columns || []).flatMap((c) =>
            (c.cards || []).map((k) => (k.titulo || "").length)
          ),
        ]
      );
      return longest > 48;
    } catch (_) {
      return false;
    }
  }, [columns]);

  function closeModal() {
    setEditing(null);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function scrollByDir(dir) {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.8) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  function moveCardBetweenWithToast(fromColumnId, toColumnId, cardId) {
    if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return;
    const from =
      columns.find((c) => c.id === fromColumnId)?.titulo || fromColumnId;
    const to = columns.find((c) => c.id === toColumnId)?.titulo || toColumnId;
    moveCard(fromColumnId, toColumnId, cardId);
    toast.notice("Tarjeta movida", `${cardId} — ${from} → ${to}`);
  }

  function handleDragOverScroll(e) {
    const el = scrollerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const threshold = 60;
    if (e.clientX - rect.left < threshold) {
      el.scrollLeft -= 20;
    } else if (rect.right - e.clientX < threshold) {
      el.scrollLeft += 20;
    }
  }

  async function handleShare() {
    try {
      const url = window.location?.href || "";
      const text = `Mira el Sprint Board${
        stats?.nombre ? `: ${stats.nombre}` : ""
      }`;
      if (navigator.share) {
        await navigator.share({ title: "Sprint Board", text, url });
        toast.info("Compartir", "Abriendo diálogo nativo de compartir");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.info("Compartir", "Enlace copiado al portapapeles");
      } else {
        window.prompt("Copia el enlace del Sprint Board:", url);
        toast.info("Compartir", "Copia el enlace mostrado");
      }
    } catch (e) {
      console.error("Error al compartir:", e);
      toast.warning(
        "No se pudo compartir",
        "Intenta copiar el enlace manualmente"
      );
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sprintBoardRoot}>
      <div className={styles.container}>
        <div className={styles.stickyHeader}>
          <div className={styles.headerRow}>
            <div className={styles.headerLeft}>
              <div className={styles.headerTitle}>
                <h1 className="text-[clamp(28px,3.4vw,36px)] leading-[clamp(32px,3.8vw,42px)] font-extrabold tracking-tight">
                  Sprint Board
                </h1>
                <Badge variant="success">{stats.estado}</Badge>
              </div>
              <p className={styles.headerSubtitle}>{stats.nombre}</p>
            </div>
            <div className={styles.actions}>
              <div className={styles.avatars}>
                {members.map((m) => (
                  <Avatar
                    key={m.id}
                    initials={m.iniciales}
                    color={m.color}
                    className={styles.avatar}
                  />
                ))}
                <Button
                  variant="light"
                  className={`${styles.actionBtn} ${styles.addButton}`}
                  aria-label="Añadir miembro"
                >
                  +
                </Button>
              </div>
              <div className={styles.headerButtons}>
                <Button
                  variant="light"
                  className={`${styles.actionBtn} ${styles.shareButton}`}
                  onClick={handleShare}
                >
                  <Share2 size={18} className={styles.shareIcon} /> Compartir
                </Button>
                <Button
                  variant="dark"
                  onClick={() => setOpenColumnId(columns?.[0]?.id || null)}
                  className={`${styles.actionBtn} ${styles.addColumnButton} text-white bg-black hover:bg-neutral-800 focus:ring-black`}
                  style={{ color: "#fff" }}
                >
                  <Plus size={18} className={styles.addColumnIcon} /> Agregar
                  Tarea
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    addColumn("Nueva columna");
                    toast.success("Columna creada", '"Nueva columna"');
                  }}
                  className={`${styles.actionBtn} ${styles.addColButton}`}
                >
                  + Columna
                </Button>
              </div>
            </div>
          </div>
          {/* Filtros */}
          <div className={styles.filtersWrap}>
            <div className={styles.filtersRow}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value.toLowerCase())}
                placeholder="Buscar por texto"
                className={styles.input}
              />
              <div className={styles.filtersRow}>
                <Select
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Owner</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.iniciales}>
                      {m.iniciales}
                    </option>
                  ))}
                </Select>
                <Select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Etiqueta</option>
                  {presetLabels.map((t) => (
                    <option key={t} value={t.toLowerCase()}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Duración</div>
            <div className={styles.statValueRow}>
              <div className={styles.statValue}>{stats.duracion}</div>
              <div className={styles.statIconWrap}>
                <Timer size={16} />
              </div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className="mb-2">
              <div className="text-sm text-gray-500">Puntos del Sprint</div>
              <div className={styles.statValue}>
                {stats.puntosHechos}/{stats.puntosTotales}
              </div>
            </div>
            <Progress
              value={stats.puntosHechos}
              max={stats.puntosTotales}
              color="orange"
              className="h-2"
            />
          </div>
          <div className={styles.statCard}>
            <div className="text-sm text-gray-500">Velocidad</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-700 flex items-center gap-2">
              <Gauge size={20} /> {stats.velocidad} pts/día
            </div>
            <div className="text-xs text-emerald-600">{stats.tendencia}</div>
          </div>
          <div className={styles.statCard}>
            <div className="text-sm text-gray-500">Equipo</div>
            <div className="mt-1 text-2xl font-semibold text-violet-700 flex items-center gap-2">
              <UsersIcon size={20} /> {stats.equipo} miembros
            </div>
            <div className="text-xs text-gray-500">Todos activos</div>
          </div>
        </div>

        <div className={styles.relative}>
          {canLeft && (
            <button
              type="button"
              className={styles.leftButton}
              onClick={() => scrollByDir("left")}
            >
              ‹
            </button>
          )}
          {canLeft && <div className={styles.leftShadow} />}
          {canRight && (
            <button
              type="button"
              className={styles.rightButton}
              onClick={() => scrollByDir("right")}
            >
              ›
            </button>
          )}
          {canRight && <div className={styles.rightShadow} />}
          <div
            ref={scrollerRef}
            className={styles.scroller}
            onDragOver={handleDragOverScroll}
          >
            <div
              className={styles.columnsRow}
              role="list"
              aria-label="Columnas del sprint"
            >
              <div style={{ width: 8, flex: "0 0 auto" }} />
              {columns.map((col) => (
                <div
                  key={col.id}
                  role="listitem"
                  aria-label={`Columna ${col.titulo}`}
                  className={styles.columnContainer}
                  ref={(el) => {
                    if (el) colRefs.current[col.id] = el;
                  }}
                >
                  <Column
                    column={col}
                    members={members}
                    onAdd={addCard}
                    onMove={{
                      between: moveCardBetweenWithToast,
                      within: (colId, draggedId, targetId) =>
                        moveCardWithin(colId, draggedId, targetId),
                    }}
                    onEdit={(columnId, card) => {
                      if (columnId === "column") {
                        if (card?.id && typeof card?.titulo === "string") {
                          renameColumn(card.id, card.titulo);
                          toast.info("Columna renombrada", `"${card.titulo}"`);
                        }
                        return;
                      }
                      setEditing({ columnId, card });
                    }}
                    onDelete={(columnId, card) => {
                      if (columnId === "column") {
                        setConfirmDlg({
                          title: "Eliminar columna",
                          message: `¿Seguro que deseas eliminar la columna "${card.titulo}"? Esta acción no se puede deshacer.`,
                          onConfirm: () => {
                            deleteColumn(card.id);
                            toast.error(
                              "Columna eliminada",
                              `"${card.titulo}"`
                            );
                          },
                        });
                        return;
                      }
                      setConfirmDlg({
                        title: "Eliminar tarjeta",
                        message: `¿Seguro que deseas eliminar la tarjeta "${card.titulo}"? Esta acción no se puede deshacer.`,
                        onConfirm: () => {
                          deleteCard(columnId, card.id);
                          toast.error(
                            "Tarjeta eliminada",
                            `${card.id} — "${card.titulo}"`
                          );
                        },
                      });
                    }}
                    forceOpen={openColumnId === col.id}
                    onOpened={() => {
                      setOpenColumnId(null);
                      const el = colRefs.current[col.id];
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          inline: "center",
                          block: "nearest",
                        });
                    }}
                    filters={{ q, owner: ownerFilter, tag: tagFilter }}
                    dense={dense}
                  />
                </div>
              ))}
              <div style={{ width: 8, flex: "0 0 auto" }} />
            </div>
          </div>
        </div>

        <Modal open={!!editing} onClose={closeModal} title="Editar tarjeta">
          {editing && (
            <EditForm
              card={editing.card}
              members={members}
              presetLabels={presetLabels}
              onCancel={closeModal}
              onSave={(payload) => {
                updateCard(editing.columnId, editing.card.id, payload);
                toast.info(
                  "Cambios guardados",
                  `${editing.card.id} — "${
                    payload.titulo || editing.card.titulo
                  }"`
                );
                if (payload.owner && payload.owner !== editing.card.owner) {
                  toast.notice(
                    "Responsable asignado",
                    `${payload.owner} para ${editing.card.id}`
                  );
                }
                closeModal();
              }}
            />
          )}
        </Modal>

        <Modal
          open={!!confirmDlg}
          onClose={() => setConfirmDlg(null)}
          title={confirmDlg?.title}
          footer={
            <>
              <Button
                variant="light"
                className="h-9 px-4"
                onClick={() => setConfirmDlg(null)}
              >
                Cancelar
              </Button>
              <Button
                className="h-9 px-4 bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => {
                  confirmDlg?.onConfirm?.();
                  setConfirmDlg(null);
                }}
              >
                Eliminar
              </Button>
            </>
          }
        >
          <p className="text-sm text-gray-600">{confirmDlg?.message}</p>
        </Modal>

        <Modal
          open={!!colOptions}
          onClose={() => {
            setColOptions(null);
            setRenameValue("");
          }}
          title="Opciones de columna"
          footer={
            <>
              <Button
                variant="light"
                className="h-9 px-4"
                onClick={() => {
                  setColOptions(null);
                  setRenameValue("");
                }}
              >
                Cerrar
              </Button>
              <Button
                className="h-9 px-4"
                onClick={() => {
                  if (!renameValue.trim()) return;
                  renameColumn(colOptions.id, renameValue.trim());
                  toast.info("Columna renombrada", `"${renameValue.trim()}"`);
                  setColOptions(null);
                  setRenameValue("");
                }}
              >
                Guardar
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Nombre actual</div>
              <div className="text-gray-800">{colOptions?.titulo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Nuevo nombre</div>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 px-3"
                placeholder="Ej. En progreso"
              />
            </div>
            <div className="pt-2">
              <Button
                variant="secondary"
                className="h-9 px-4"
                onClick={() => {
                  setConfirmDlg({
                    title: "Eliminar columna",
                    message: `¿Seguro que deseas eliminar la columna "${colOptions?.titulo}"? Esta acción no se puede deshacer.`,
                    onConfirm: () => {
                      if (colOptions?.id) {
                        deleteColumn(colOptions.id);
                        toast.error(
                          "Columna eliminada",
                          `"${colOptions?.titulo}"`
                        );
                      }
                    },
                  });
                  setColOptions(null);
                }}
              >
                Eliminar columna
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
