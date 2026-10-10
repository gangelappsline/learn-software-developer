import { Check } from 'lucide-react';
import { AVATARS } from '@/lib/constants';

interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="avatar-picker" role="radiogroup" aria-label="Elige un avatar">
      {AVATARS.map((avatar) => (
        <button
          key={avatar}
          type="button"
          className={`avatar-option ${value === avatar ? 'avatar-selected' : ''}`}
          autoFocus={avatar === AVATARS[0]}
          role="radio"
          aria-checked={value === avatar}
          onClick={() => onChange(avatar)}
        >
          {avatar}
          {value === avatar && (
            <span className="avatar-check" aria-hidden="true">
              <Check size={13} />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
