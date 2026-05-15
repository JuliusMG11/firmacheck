'use client';

import { useState, type FormEvent } from 'react';
import { validateIco } from '@/lib/ico';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface SearchBarProps {
  onSearch: (ico: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ico = value.trim();
    if (!validateIco(ico)) {
      setError('IČO musí mít 8 číslic a platný kontrolní součet.');
      return;
    }
    setError(undefined);
    onSearch(ico);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <div className="flex-1">
        <Input
          id="ico"
          placeholder="např. 27074358"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(undefined);
          }}
          error={error}
          maxLength={8}
          inputMode="numeric"
          aria-label="IČO"
          className="py-3 text-base rounded-xl shadow-sm"
        />
      </div>
      <Button type="submit" loading={loading} className="py-3 px-6 rounded-xl shrink-0">
        Vyhledat
      </Button>
    </form>
  );
}
