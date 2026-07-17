import { createElement } from 'react';

export default function MetricCard({ label, value, icon: Icon, tone, description }) {
  return (
    <article className="metric-card">
      <div className={`metric-card__icon tone-${tone}`}>{createElement(Icon, { size: 20, 'aria-hidden': true })}</div>
      <div><span>{label}</span><strong>{value}</strong><small>{description}</small></div>
    </article>
  );
}
