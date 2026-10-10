import { BookOpen, Compass, Trophy } from 'lucide-react';

export function Footer({ completedCount }: { completedCount: number }) {
  return (
    <footer className="dashboard-footer">
      <span>
        <BookOpen size={14} /> Hecho para aprender, no para competir.
      </span>
      <span>
        <Trophy size={14} /> {completedCount} misiones completadas
      </span>
      <span>
        <Compass size={14} /> Tu ritmo, tus reglas.
      </span>
    </footer>
  );
}
