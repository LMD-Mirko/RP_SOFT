import { Lock, User } from 'lucide-react'
import { useUserProfile } from '../../hooks/useUserProfile'
import { Form, FormField } from '../ui/Form'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useEffect, useState } from 'react'

export function UserProfile() {
  const { loading, profile, editing, setEditing, save, saving, updatePassword } = useUserProfile()
  const [pwdOpen, setPwdOpen] = useState(false)
  const [pwd, setPwd] = useState({ actual: '', nueva: '' })

  // Estados de formulario: deben declararse siempre, no después de un return condicional
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [carrera, setCarrera] = useState('')
  const [rol, setRol] = useState('')

  // Sincronizar cuando el perfil esté disponible
  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '')
      setEmail(profile.email || '')
      setTelefono(profile.telefono || '')
      setCarrera(profile.carrera || '')
      setRol(profile.rol || '')
    }
  }, [profile])

  if (loading || !profile) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
  }

  const onSubmit = () => {
    if (!editing) return
    save({ nombre, email, telefono, carrera, rol })
  }

  const changePwd = async () => {
    await updatePassword(pwd)
    setPwdOpen(false)
    setPwd({ actual: '', nueva: '' })
  }

  return (
    <div className="space-y-5">
      {/* Datos personales */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <User size={18} />
            <div className="font-semibold text-gray-900">Datos personales</div>
          </div>
          <Button variant="dark" onClick={() => setEditing((v) => !v)}>{editing ? 'Cancelar' : 'Editar'}</Button>
        </div>

        <div className="p-5">
          <Form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre completo">
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={!editing} placeholder="Juan Perez" />
              </FormField>
              <FormField label="Email">
                <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} placeholder="Juan Perez@gmail.com" />
              </FormField>
              <FormField label="Telefono">
                <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} disabled={!editing} placeholder="999 999 999" />
              </FormField>
              <FormField label="Carrera">
                <Input value={carrera} onChange={(e) => setCarrera(e.target.value)} disabled={!editing} placeholder="Ingeniería de Software con IA" />
              </FormField>
              <FormField label="Rol">
                <Input value={rol} onChange={(e) => setRol(e.target.value)} disabled={!editing} placeholder="Frontend" />
              </FormField>
            </div>

            <div className="pt-3 flex justify-end">
              <Button type="submit" variant="primary" disabled={!editing || saving}>Guardar</Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Seguridad */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <Lock size={18} />
            <div className="font-semibold text-gray-900">Seguridad</div>
          </div>
          <Button variant="dark" onClick={() => setPwdOpen(true)}>Cambiar Contraseña</Button>
        </div>
        <div className="p-5" />
      </div>

      <Modal open={pwdOpen} onClose={() => setPwdOpen(false)} title="Cambiar Contraseña" footer={null}>
        <Form onSubmit={changePwd}>
          <FormField label="Contraseña actual">
            <Input type="password" value={pwd.actual} onChange={(e) => setPwd((p) => ({ ...p, actual: e.target.value }))} />
          </FormField>
          <FormField label="Nueva contraseña">
            <Input type="password" value={pwd.nueva} onChange={(e) => setPwd((p) => ({ ...p, nueva: e.target.value }))} />
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="light" type="button" onClick={() => setPwdOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Guardar</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
