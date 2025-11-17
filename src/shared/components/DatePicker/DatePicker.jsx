import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar } from 'lucide-react'
import { forwardRef } from 'react'
import styles from './DatePicker.module.css'

// Custom input component
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className={styles.inputWrapper} onClick={onClick} ref={ref}>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly
      className={styles.input}
    />
    <Calendar size={18} className={styles.icon} />
  </div>
))

CustomInput.displayName = 'CustomInput'

export function DatePicker({
  selected,
  onChange,
  placeholder = 'Seleccionar fecha',
  minDate = null,
  maxDate = null,
  withPortal = false,
  ...props
}) {
  return (
    <div className={styles.container}>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        customInput={<CustomInput placeholder={placeholder} />}
        dateFormat="dd/MM/yyyy"
        minDate={minDate}
        maxDate={maxDate}
        calendarClassName={styles.calendar}
        wrapperClassName={styles.wrapper}
        withPortal={withPortal}
        popperModifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'viewport',
              tether: false,
              altAxis: true,
            },
          },
        ]}
        {...props}
      />
    </div>
  )
}

