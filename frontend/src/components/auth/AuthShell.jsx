import { Link } from 'react-router-dom';
import Brand from '../ui/Brand';
import ThemeToggle from '../ui/ThemeToggle';

export default function AuthShell({ title, description, children, footerText, footerLink, footerLabel }) {
  return (
    <main className="auth-page">
      <div className="auth-page__ambient auth-page__ambient--one" />
      <div className="auth-page__ambient auth-page__ambient--two" />
      <div className="auth-page__theme"><ThemeToggle /></div>
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-card__brand">
          <Brand stacked />
          <p className="asset-hint">Espacio preparado para tu logo</p>
        </div>
        <div className="auth-card__heading">
          <h1 id="auth-title">{title}</h1>
          <p>{description}</p>
        </div>
        {children}
        <p className="auth-card__footer">
          {footerText} <Link to={footerLink}>{footerLabel}</Link>
        </p>
      </section>
    </main>
  );
}
