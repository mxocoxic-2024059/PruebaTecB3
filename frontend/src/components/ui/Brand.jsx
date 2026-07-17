import { useState } from 'react';

export default function Brand({ compact = false, stacked = false }) {
  const [imageAvailable, setImageAvailable] = useState(true);

  return (
    <div className={`brand ${stacked ? 'brand--stacked' : ''}`} aria-label="TaskFlow">
      {imageAvailable ? (
        <img
          className="brand__image"
          src="/taskflow-icon.png"
          alt=""
          onError={() => setImageAvailable(false)}
        />
      ) : (
        <span className="brand__placeholder" aria-hidden="true" title="Coloca aquí taskflow-icon.png">
          Logo
        </span>
      )}
      {!compact && (
        <span className="brand__name">
          Task<span>Flow</span>
        </span>
      )}
    </div>
  );
}
