import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-planet">
        🪐<span>404</span>
      </div>
      <span className="section-kicker">ESTA ÓRBITA NO EXISTE</span>
      <h2>¡Ups! Nos perdimos en el espacio.</h2>
      <p>No encontramos esa página, pero siempre puedes volver a tu mapa de aventuras.</p>
      <Link to="/dashboard">
        <Button icon={<Compass size={17} />}>Volver a tu aventura</Button>
      </Link>
    </div>
  );
}
