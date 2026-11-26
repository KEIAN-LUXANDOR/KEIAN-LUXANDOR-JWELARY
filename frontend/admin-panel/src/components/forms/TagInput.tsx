'use client';

import { useState, type KeyboardEvent } from 'react';
import Icon from '@/components/common/Icon';

interface TagInputProps {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

/** A list of short values (tags, ring sizes, spec values). Type and press Enter to add. */
export default function TagInput({ id, label, values, onChange, placeholder = 'Type and press Enter' }: TagInputProps) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (v && !values.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...values, v]);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="field field--full">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className="tag-input">
        {values.map((v) => (
          <span key={v} className="chip">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
              <Icon name="close" size={12} />
            </button>
          </span>
        ))}
        <input id={id} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} onBlur={add} placeholder={values.length ? '' : placeholder} />
      </div>
    </div>
  );
}
