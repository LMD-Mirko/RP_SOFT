import { useState, useEffect } from 'react';
import { Select } from '@shared/components/Select';
import { CreditCard } from 'lucide-react';
import { getDocumentTypes } from './documentTypeService';

/**
 * Componente Select para selección de tipo de documento
 * Carga los tipos de documentos desde la API
 */
export function DocumentTypeSelect({
  label,
  error,
  helperText,
  value,
  onChange,
  placeholder = 'Seleccione tipo de documento...',
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

  // Cargar tipos de documentos al montar el componente
  useEffect(() => {
    const loadDocumentTypes = async () => {
      setLoading(true);
      try {
        const documentTypes = await getDocumentTypes();
        
        // Transformar a formato requerido por Select
        const formattedOptions = documentTypes.map(docType => ({
          value: docType.id,
          label: docType.name,
          description: docType.description,
          Icon: CreditCard, // Icono para todos los items
        }));
        
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error al cargar tipos de documentos:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocumentTypes();
  }, []);

  return (
    <Select
      label={label}
      error={error}
      helperText={helperText}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={loading ? 'Cargando...' : placeholder}
      className={className}
      fullWidth={fullWidth}
      required={required}
      id={id}
      name={name}
      disabled={disabled || loading}
      {...props}
    />
  );
}

