import { Upload, Plus, FolderOpen, Star, TrendingUp, Tags, Search, Filter } from "lucide-react"
import { useState } from "react"
import { useHistoryRepo } from "../../../hooks/useHistoryRepo"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { TemplateCard } from "../components/TemplateCard"
import styles from "../styles/HistoryRepo.module.css"

export function HistoryRepo() {
  const {
    loading, stats, filters, templates,
    query, setQuery, categoria, setCategoria,
    etiqueta, setEtiqueta, puntos, setPuntos,
    orden, setOrden, tab, setTab
  } = useHistoryRepo()

  const tabs = ['Todas', 'Más populares', 'Recientes', 'Favoritas']
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.contentPadding}>
        <div className={styles.contentMax}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Repositorio de Historias</h1>
              <p className={styles.subtitle}>
                Biblioteca de historias de usuario reutilizables para acelerar la planificación.
              </p>
            </div>
            <div className={styles.actions}>
              <Button variant="light">
                <Upload size={18} className={styles.iconLeft} /> Importar Plantillas
              </Button>
              <Button variant="dark">
                <Plus size={18} className={styles.iconLeft} /> Nueva Plantilla
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <Card title="Total de Plantillas" value={stats.total} icon={FolderOpen} color="blue" />
            <Card title="Más Usadas" value={stats.masUsadas} icon={Star} color="orange" />
            <Card title="Clonadas este mes" value={stats.clonadasMes} icon={TrendingUp} color="green" />
            <Card title="Categorías" value={stats.categorias} icon={Tags} color="violet" />
          </div>

          {/* 🔍 Filtros con animación de apertura */}
          <div className={` ${filtersOpen ? styles.open : ""}`}>
            <div className={`${styles.filtersCard} ${filtersOpen ? styles.open : ""}`}>
              <div className={styles.searchWrapper}>
                <Input
                  placeholder="Buscar plantillas de historias..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  leftIcon={<Search size={18} className={styles.searchIcon} />}
                  rightIcon={
                    <button
                      type="button"
                      aria-expanded={filtersOpen}
                      aria-label="Mostrar filtros"
                      title="Mostrar filtros"
                      className={styles.filterToggle}
                      onClick={() => setFiltersOpen((prev) => !prev)}
                    >
                      <Filter size={18} />
                    </button>
                  }
                />
              </div>
              
              <div className={styles.filtersGrid}>
                {[
                  { value: orden, setter: setOrden, options: filters.orden },
                  { value: categoria, setter: setCategoria, options: filters.categorias },
                  { value: etiqueta, setter: setEtiqueta, options: filters.etiquetas },
                  { value: puntos, setter: setPuntos, options: filters.puntos },
                ].map((f, i) => (
                  <div key={i} className={styles.selectWrapper}>
                    <Select
                      className={styles.selectControl}
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                    >
                      {f.options.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tarjetas */}
          <div className={styles.cardsGrid}>
            {loading ? (
              <div className={styles.placeholderCard}>Cargando...</div>
            ) : templates.length === 0 ? (
              <div className={styles.placeholderCard}>No se encontraron plantillas</div>
            ) : (
              templates.map((tpl) => <TemplateCard key={tpl.code} tpl={tpl} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
