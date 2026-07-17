import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import Brand from '../components/ui/Brand';

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <Brand />
      <SearchX size={58} aria-hidden="true" />
      <p className="eyebrow">Error 404</p>
      <h1>Esta página no existe</h1>
      <p>La dirección puede haber cambiado o no estar disponible.</p>
      <Link className="button button--primary" to="/"><ArrowLeft size={19} /> Volver a TaskFlow</Link>
    </main>
  );
}
