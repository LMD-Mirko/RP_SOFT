import { Star, TrendingUp, Tags, Copy } from "lucide-react"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import styles from "../styles/TemplateCard.module.css"

export function TemplateCard({ tpl }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.code}>{tpl.code}</div>
        <button className={styles.optionsButton}>
          <span className={styles.srOnly}>Opciones</span>
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </button>
      </div>

      <div className={styles.stars}>
        {Array.from({ length: tpl.stars || 0 }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>

      <h3 className={styles.title}>{tpl.title}</h3>
      <p className={styles.desc}>{tpl.desc}</p>

      <div className={styles.tagWrap}>
        {tpl.tag && <Badge variant="info">{tpl.tag}</Badge>}
      </div>

      <div className={styles.footer}>
        <div className={styles.metrics}>
          <span className={styles.metric} title="Clones">
            <TrendingUp size={16} /> {tpl.clones}
          </span>
          <span className={styles.metric} title="Puntos">
            <Tags size={16} /> {tpl.puntos}pts
          </span>
        </div>
        <Button variant="light" className={styles.cloneButton}>
          <Copy size={16} className={styles.iconLeft} /> Clonar
        </Button>
      </div>
    </div>
  )
}
