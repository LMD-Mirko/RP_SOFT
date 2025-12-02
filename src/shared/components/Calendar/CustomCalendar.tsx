import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, theme, ConfigProvider } from 'antd'
import es_ES from 'antd/locale/es_ES'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/es'

dayjs.extend(customParseFormat)
dayjs.locale('es')

export type CustomCalendarProps = {
  value?: Dayjs | null
  onSelect?: (date: Dayjs) => void
  onPanelChange?: (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => void
  title?: string
  width?: number
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value = null,
  onSelect,
  onPanelChange,
  title = 'Calendario',
  width = 380,
}) => {
  const { token } = theme.useToken()

  const wrapperStyle: React.CSSProperties = {
    width,
    padding: '20px',
    background: '#ffffff',
    border: '1px solid #eef2ff',
    borderRadius: '18px',
    boxShadow: '0 12px 30px rgba(17,24,39,0.06)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  }

  const calendarStyle: React.CSSProperties = {
    borderRadius: '14px',
    overflow: 'hidden',
    background: '#fbfdff',
    filter: 'brightness(0.995)',
    transition: 'transform 0.2s ease',
  }

  const handlePanelChange = (v: Dayjs, m: CalendarProps<Dayjs>['mode']) => {
    if (onPanelChange) onPanelChange(v, m)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={wrapperStyle}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 18px 40px rgba(17,24,39,0.12)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 30px rgba(17,24,39,0.06)'
        }}
      >
        <h3
          style={{
            textAlign: 'center',
            marginBottom: '12px',
            fontWeight: 800,
            fontSize: '18px',
            color: '#0f172a',
            letterSpacing: '0.2px',
          }}
        >
          {title}
        </h3>

        <div
          style={calendarStyle}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.01)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
          }}
        >
          <ConfigProvider locale={es_ES} theme={{ token: { colorPrimary: '#2563eb', colorInfo: '#2563eb' } }}>
            <Calendar
              fullscreen={false}
              value={value ?? undefined}
              onSelect={(d: Dayjs) => {
                if (onSelect) onSelect(d)
              }}
              onPanelChange={handlePanelChange}
            />
          </ConfigProvider>
        </div>
      </div>
    </div>
  )
}

// --- Utilities ---
// Parse partial input and return a dayjs object if any parts are valid.
// Supports: "DD", "DD-MM", "DD-MM-YYYY" with '-' or '/'.
export function parsePartialDate(input: string | null | undefined): Dayjs | null {
  if (!input) return null
  const s = input.trim().replace(/\//g, '-').replace(/\s+/g, '')
  const parts = s.split('-').filter(Boolean)
  const today = dayjs()

  if (!parts.every(p => /^\d+$/.test(p))) return null

  try {
    if (parts.length === 1) {
      const day = parseInt(parts[0], 10)
      if (day >= 1 && day <= 31) {
        return today.date(day)
      }
      return null
    }

    if (parts.length === 2) {
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10)
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        return today.month(month - 1).date(day)
      }
      return null
    }

    if (parts.length >= 3) {
      const dd = parts[0]
      const mm = parts[1]
      const yyyy = parts[2]
      const candidate = dayjs(`${dd}-${mm}-${yyyy}`, 'DD-MM-YYYY', true)
      if (candidate.isValid()) return candidate
      const flex = dayjs(`${dd}-${mm}-${yyyy}`, 'D-M-YYYY', true)
      if (flex.isValid()) return flex
      return null
    }
  } catch (e) {
    return null
  }

  return null
}

// --- PopoverCalendar (anchored popover) ---
export type PopoverCalendarProps = {
  open?: boolean
  anchorEl?: HTMLElement | null
  initialValue?: Dayjs | null
  onSelect?: (d: Dayjs | null) => void
  onClose?: () => void
  width?: number
  title?: string
}

export const PopoverCalendar: React.FC<PopoverCalendarProps> = ({
  open = false,
  anchorEl = null,
  initialValue = null,
  onSelect = () => {},
  onClose = () => {},
  width = 320,
  title = 'Seleccionar fecha',
}) => {
  const popRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState({ top: -9999, left: -9999 })
  const [placement, setPlacement] = useState<'above' | 'below'>('above')

  useLayoutEffect(() => {
    if (!open || !anchorEl) return

    const rect = anchorEl.getBoundingClientRect()
    const scrollY = window.scrollY || window.pageYOffset
    const scrollX = window.scrollX || window.pageXOffset

    setPos({ top: -9999, left: -9999 })

    requestAnimationFrame(() => {
      const pop = popRef.current
      const popHeight = pop ? pop.offsetHeight : 300
      const popWidth = pop ? pop.offsetWidth : width

      const availableAbove = rect.top
      const availableBelow = window.innerHeight - rect.bottom

      let top: number
      let chosenPlacement: 'above' | 'below' = 'above'

      if (availableAbove >= popHeight + 8) {
        top = rect.top + scrollY - popHeight - 8
        chosenPlacement = 'above'
      } else if (availableBelow >= popHeight + 8) {
        top = rect.bottom + scrollY + 8
        chosenPlacement = 'below'
      } else {
        if (availableAbove >= availableBelow) {
          top = Math.max(scrollY + 8, rect.top + scrollY - popHeight - 8)
          chosenPlacement = 'above'
        } else {
          top = rect.bottom + scrollY + 8
          chosenPlacement = 'below'
        }
      }

      let left = rect.left + scrollX + rect.width / 2 - popWidth / 2
      const minLeft = scrollX + 8
      const maxRight = scrollX + window.innerWidth - 8
      if (left < minLeft) left = minLeft
      if (left + popWidth > maxRight) left = Math.max(minLeft, maxRight - popWidth)

      setPlacement(chosenPlacement)
      setPos({ top, left })
    })
  }, [open, anchorEl, width])

  useEffect(() => {
    if (!open) return

    const handleOutside = (e: MouseEvent) => {
      const pop = popRef.current
      if (!pop) return
      if (pop.contains(e.target as Node)) return
      if (anchorEl && anchorEl.contains(e.target as Node)) return
      onClose()
    }

    document.addEventListener('mousedown', handleOutside)
    window.addEventListener('resize', onClose)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('resize', onClose)
    }
  }, [open, anchorEl, onClose])

  if (!open) return null

  const arrowSize = 10
  const arrowStyle: React.CSSProperties = {
    width: 0,
    height: 0,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 250001,
  }

  const pop = (
    <div
      ref={popRef}
      style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 250000 }}
      role="dialog"
      aria-label={title}
    >
      {placement === 'above' ? (
        <div style={{ ...arrowStyle, bottom: -arrowSize, borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderTop: `${arrowSize}px solid white` }} />
      ) : (
        <div style={{ ...arrowStyle, top: -arrowSize, borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid white` }} />
      )}

      <div style={{ padding: 8, background: 'transparent' }}>
        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <CustomCalendar
            value={initialValue}
            onSelect={(d: Dayjs) => {
              onSelect(d ?? null)
              onClose()
            }}
            title={title}
            width={width}
          />
        </div>
      </div>
    </div>
  )

  return createPortal(pop, document.body)
}

export default CustomCalendar