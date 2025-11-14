import { useState, useEffect, useCallback } from 'react';
import { Cascader } from 'antd';
import { getRegiones, getProvincias, getDistritos } from '@features/seleccion-practicantes/services/ubicacionService';
import clsx from 'clsx';
import styles from './CascadeSelect.module.css';

/**
 * Componente CascadeSelect para selección de ubicación (Región > Provincia > Distrito)
 * Utiliza Ant Design Cascader con carga dinámica de datos en cascada
 */
export function CascadeSelect({
  label,
  error,
  helperText,
  value,
  onChange,
  placeholder = 'Seleccione ubicación...',
  className,
  fullWidth = true,
  required = false,
  id,
  name,
  disabled = false,
  ...props
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar regiones al montar el componente
  useEffect(() => {
    const loadRegiones = async () => {
      setLoading(true);
      try {
        const regiones = await getRegiones();
        
        // Transformar a formato requerido por Cascader
        const formattedOptions = regiones.map(region => ({
          label: region.name,
          value: region.id,
          isLeaf: false, // Indica que tiene hijos (provincias)
        }));
        
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error al cargar regiones:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadRegiones();
  }, []);

  // Función para cargar datos hijos dinámicamente
  const loadData = useCallback(async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    
    // Si ya tiene hijos cargados, no hacer nada
    if (targetOption.children && targetOption.children.length > 0) {
      return;
    }

    targetOption.loading = true;
    setOptions(prevOptions => [...prevOptions]);

    try {
      let children = [];
      
      // Si es una región, cargar provincias
      if (selectedOptions.length === 1) {
        const provincias = await getProvincias(targetOption.value);
        children = provincias.map(provincia => ({
          label: provincia.name,
          value: provincia.id,
          isLeaf: false, // Indica que tiene hijos (distritos)
        }));
      }
      // Si es una provincia, cargar distritos
      else if (selectedOptions.length === 2) {
        const distritos = await getDistritos(targetOption.value);
        children = distritos.map(distrito => ({
          label: distrito.name,
          value: distrito.id,
          isLeaf: true, // Los distritos son hojas (no tienen hijos)
        }));
      }

      targetOption.children = children;
      targetOption.loading = false;
      setOptions(prevOptions => [...prevOptions]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      targetOption.loading = false;
      setOptions(prevOptions => [...prevOptions]);
    }
  }, []);

  // Manejar cambio de selección
  const handleChange = (value, selectedOptions) => {
    // Si se selecciona un distrito (3 niveles), emitir el evento onChange
    if (value && value.length === 3) {
      const distritoId = value[2];
      const event = {
        target: {
          name: name,
          value: distritoId,
          selectedData: {
            distrito: {
              id: distritoId,
              name: selectedOptions[2]?.label
            },
            provincia: {
              id: value[1],
              name: selectedOptions[1]?.label
            },
            region: {
              id: value[0],
              name: selectedOptions[0]?.label
            }
          }
        }
      };
      
      onChange?.(event);
    } else if (!value || value.length === 0) {
      // Si se limpia la selección
      const event = {
        target: {
          name: name,
          value: null
        }
      };
      onChange?.(event);
    }
  };

  return (
    <div 
      className={clsx(styles.container, fullWidth && styles.fullWidth, className)} 
    >
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.selectWrapper}>
        <Cascader
          options={options}
          loadData={loadData}
          onChange={handleChange}
          placeholder={loading ? 'Cargando...' : placeholder}
          changeOnSelect={false}
          disabled={disabled || loading}
          className={clsx(
            styles.cascader,
            error && styles.error
          )}
          style={{ width: '100%' }}
          {...props}
        />
      </div>
      
      {helperText && (
        <span className={clsx(styles.helperText, error && styles.errorText)}>
          {helperText}
        </span>
      )}
      
      {error && (
        <span className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
}

