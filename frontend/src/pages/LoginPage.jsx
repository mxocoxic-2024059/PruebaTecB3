import { useEffect, useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import { login } from '../api/authApi';
import { ApiError } from '../api/httpClient';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { startSession, sessionNotice, consumeSessionNotice } = useAuth();
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const notice = location.state?.message || sessionNotice || location.state?.success || '';

  useEffect(() => {
    if (sessionNotice) consumeSessionNotice();
  }, [sessionNotice, consumeSessionNotice]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setGeneralError('');
  }

  function validate() {
    const nextErrors = {};
    if (!form.correo.trim()) nextErrors.correo = 'Ingresa tu correo electrónico.';
    if (!form.contrasena) nextErrors.contrasena = 'Ingresa tu contraseña.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError('');
    try {
      const response = await login({ correo: form.correo.trim(), contrasena: form.contrasena });
      startSession(response);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (error) {
      setGeneralError(error instanceof ApiError ? error.message : 'No fue posible conectar con el servicio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Bienvenido de nuevo"
      description="Inicia sesión y continúa organizando tus tareas."
      footerText="¿No tienes una cuenta?"
      footerLink="/register"
      footerLabel="Crear cuenta"
    >
      {notice && <div className="notice notice--success" role="status" aria-live="polite">{notice}</div>}
      {generalError && <div className="notice notice--error" role="alert" aria-live="assertive">{generalError}</div>}
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="login-correo">Correo electrónico</label>
          <input
            id="login-correo"
            name="correo"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={form.correo}
            onChange={updateField}
            aria-invalid={Boolean(errors.correo)}
            aria-describedby={errors.correo ? 'login-correo-error' : undefined}
          />
          {errors.correo && <span id="login-correo-error" className="field-error">{errors.correo}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="login-contrasena">Contraseña</label>
          <div className="password-field">
            <input
              id="login-contrasena"
              name="contrasena"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              value={form.contrasena}
              onChange={updateField}
              aria-invalid={Boolean(errors.contrasena)}
              aria-describedby={errors.contrasena ? 'login-contrasena-error' : undefined}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {errors.contrasena && <span id="login-contrasena-error" className="field-error">{errors.contrasena}</span>}
        </div>
        <button className="button button--primary button--wide" type="submit" disabled={loading}>
          <LogIn size={19} /> {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </button>
      </form>
    </AuthShell>
  );
}
