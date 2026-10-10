import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { AGE_GROUPS, DIFFICULTIES, VALUE_TAGS } from '@/lib/constants';
import { languages } from '@/data/languages';
import type {
  Difficulty,
  LanguageId,
  MissionFilters as MissionFilterValues,
  ValueTag,
} from '@/types';
import { Button } from '@/components/ui';

interface MissionFiltersProps {
  filters: MissionFilterValues;
  activeCount: number;
  onLanguage: (value: LanguageId | 'all') => void;
  onAgeGroup: (value: MissionFilterValues['ageGroup']) => void;
  onDifficulty: (value: Difficulty | 'all') => void;
  onValue: (value: ValueTag | 'all') => void;
  onDuration: (value: MissionFilterValues['duration']) => void;
  onSearch: (value: string) => void;
  onReset: () => void;
}

export function MissionFilters({
  filters,
  activeCount,
  onLanguage,
  onAgeGroup,
  onDifficulty,
  onValue,
  onDuration,
  onSearch,
  onReset,
}: MissionFiltersProps) {
  return (
    <section className="filter-panel" aria-label="Filtrar misiones">
      <div className="filter-panel-heading">
        <span className="filter-heading-icon">
          <SlidersHorizontal size={17} />
        </span>
        <div>
          <strong>Encuentra tu próximo reto</strong>
          <small>
            {activeCount ? `${activeCount} filtros activos` : 'Combina filtros a tu gusto'}
          </small>
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={onReset}
            type="button"
          >
            Limpiar
          </Button>
        )}
      </div>
      <div className="filter-controls">
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Buscar misiones</span>
          <input
            type="search"
            placeholder="Buscar una misión…"
            value={filters.search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </label>
        <label className="filter-select-label">
          <span className="sr-only">Lenguaje</span>
          <select
            className="filter-select"
            value={filters.language}
            onChange={(event) => onLanguage(event.target.value as LanguageId | 'all')}
          >
            <option value="all">Todos los lenguajes</option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.emoji} {language.name}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-select-label">
          <span className="sr-only">Edad recomendada</span>
          <select
            className="filter-select"
            value={filters.ageGroup}
            onChange={(event) => onAgeGroup(event.target.value as MissionFilterValues['ageGroup'])}
          >
            <option value="all">Mi edad automáticamente</option>
            {AGE_GROUPS.map((age) => (
              <option key={age.id} value={age.id}>
                {age.label}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-select-label">
          <span className="sr-only">Dificultad</span>
          <select
            className="filter-select"
            value={filters.difficulty}
            onChange={(event) => onDifficulty(event.target.value as Difficulty | 'all')}
          >
            <option value="all">Cualquier dificultad</option>
            {Object.entries(DIFFICULTIES).map(([id, difficulty]) => (
              <option key={id} value={id}>
                {difficulty.emoji} {difficulty.label}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-select-label">
          <span className="sr-only">Valor educativo</span>
          <select
            className="filter-select"
            value={filters.value}
            onChange={(event) => onValue(event.target.value as ValueTag | 'all')}
          >
            <option value="all">Todos los valores</option>
            {VALUE_TAGS.map((value) => (
              <option key={value.id} value={value.id}>
                {value.emoji} {value.label}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-select-label">
          <span className="sr-only">Duración</span>
          <select
            className="filter-select"
            value={filters.duration}
            onChange={(event) => onDuration(event.target.value as MissionFilterValues['duration'])}
          >
            <option value="all">Cualquier duración</option>
            <option value="quick">5 min o menos</option>
            <option value="medium">6–15 min</option>
            <option value="long">Más de 15 min</option>
          </select>
        </label>
      </div>
    </section>
  );
}
