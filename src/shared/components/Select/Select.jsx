import { forwardRef, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import clsx from 'clsx'
import styles from './Select.module.css'

export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Seleccionar...',
  className,
  fullWidth = true,
  value,
  onChange,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value)

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      
      // Verificar si hay espacio debajo, si no, mostrar arriba
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const dropdownHeight = 250 // max-height aproximado
      const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
      
      setDropdownPosition({
        top: showAbove ? rect.top - dropdownHeight : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideContainer = containerRef.current?.contains(event.target)
      const isClickInsideDropdown = dropdownRef.current?.contains(event.target)
      
      if (!isClickInsideContainer && !isClickInsideDropdown) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Actualizar posición inmediatamente y luego con un pequeño delay para asegurar
      requestAnimationFrame(() => {
        updateDropdownPosition()
        setTimeout(updateDropdownPosition, 10)
      })
      window.addEventListener('scroll', updateDropdownPosition, true)
      window.addEventListener('resize', updateDropdownPosition)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', updateDropdownPosition, true)
      window.removeEventListener('resize', updateDropdownPosition)
    }
  }, [isOpen])

  const handleSelect = (optionValue) => {
    onChange({ target: { name: props.name, value: optionValue } })
    setIsOpen(false)
  }

  return (
    <div 
      className={clsx(styles.container, fullWidth && styles.fullWidth, className)} 
      ref={containerRef}
    >
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.selectWrapper}>
        <button
          ref={(node) => {
            buttonRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          type="button"
          className={clsx(
            styles.select,
            error && styles.error,
            isOpen && styles.open,
            !selectedOption && styles.placeholder
          )}
          onClick={() => {
            const newIsOpen = !isOpen
            setIsOpen(newIsOpen)
            if (newIsOpen) {
              // Usar requestAnimationFrame para asegurar que el DOM esté actualizado
              requestAnimationFrame(() => {
                updateDropdownPosition()
              })
            }
          }}
        >
          <span className={styles.selectedValue}>
            {selectedOption ? (
              <>
                {selectedOption.Icon && <selectedOption.Icon size={16} className={styles.optionIcon} />}
                {selectedOption.label}
              </>
            ) : (
              placeholder
            )}
          </span>
          <ChevronDown size={18} className={clsx(styles.icon, isOpen && styles.iconOpen)} />
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <div 
            ref={dropdownRef}
            className={styles.dropdown}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={clsx(
                  styles.option,
                  option.value === value && styles.optionSelected
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.Icon && <option.Icon size={16} className={styles.optionIconInner} />}
                <span className={styles.optionLabel}>{option.label}</span>
                {option.value === value && <Check size={16} className={styles.checkIcon} />}
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>
      
      {helperText && (
        <span className={clsx(styles.helperText, error && styles.errorText)}>
          {helperText}
        </span>
      )}
    </div>
  )
})

Select.displayName = 'Select'

