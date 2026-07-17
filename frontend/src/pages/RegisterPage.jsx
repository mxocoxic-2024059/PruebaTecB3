import { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import { register } from '../api/authApi';
import { ApiError } from '../api/httpClient';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', confirmar: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setGeneralError('');
  }

  function validate() {
    const nextErrors = {};
    const nombre = form.nombre.trim();
    if (nombre.length < 2 || nombre.length > 100) nextErrors.nombre = 'El nombre debe tener entre 2 y 100 caracteres.';
    if (!EMAIL_PATTERN.test(form.correo.trim())) nextErrors.correo = 'Ingresa un correo electrónico válido.';
    if (form.contrasena.length < 8) nextErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
    if (form.confirmar !== form.contrasena) nextErrors.confirmar = 'Las contraseñas no coinciden.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError('');
    try {
      await register({ nombre: form.nombre.trim(), correo: form.correo.trim(), contrasena: form.contrasena });
      navigate('/login', {
        replace: true,
        state: { success: 'Cuenta creada correctamente. Ya puedes iniciar sesión.' },
      });
    } catch (error) {
      setGeneralError(error instanceof ApiError ? error.message : 'No fue posible conectar con el servicio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Crea tu cuenta"
      description="Únete a TaskFlow y organiza tu trabajo en un solo lugar."
      footerText="¿Ya tienes una cuenta?"
      footerLink="/login"
      footerLabel="Iniciar sesión"
    >
      {generalError && <div className="notice notice--error" role="alert" aria-live="assertive">{generalError}</div>}
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="register-nombre">Nombre completo</label>
          <input id="register-nombre" name="nombre" autoComplete="name" placeholder="Juan Pérez" value={form.nombre} onChange={updateField} aria-invalid={Boolean(errors.nombre)} />
          {errors.nombre && <span className="field-error">{errors.nombre}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="register-correo">Correo electrónico</label>
          <input id="register-correo" name="correo" type="email" autoComplete="email" placeholder="juan@correo.com" value={form.correo} onChange={updateField} aria-invalid={Boolean(errors.correo)} />
          {errors.correo && <span className="field-error">{errors.correo}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="register-contrasena">Contraseña</label>
          <div className="password-field">
            <input id="register-contrasena" name="contrasena" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={form.contrasena} onChange={updateField} aria-invalid={Boolean(errors.contrasena)} />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
          </div>
          {errors.contrasena && <span className="field-error">{errors.contrasena}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="register-confirmar">Confirmar contraseña</label>
          <input id="register-confirmar" name="confirmar" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Repite tu contraseña" value={form.confirmar} onChange={updateField} aria-invalid={Boolean(errors.confirmar)} />
          {errors.confirmar && <span className="field-error">{errors.confirmar}</span>}
        </div>
        <button className="button button--primary button--wide" type="submit" disabled={loading}>
          <UserPlus size={19} /> {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthShell>
  );
}
