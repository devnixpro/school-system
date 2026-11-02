'use client';

import { useCallback, useEffect, useState } from 'react';
import { parentService } from '@/services/parentService';

const KEY = 'parent:selectedChild';

// Loads the parent's children once, and remembers which one is selected
// across all parent pages (overview, attendance, fees, ...).
export default function useSelectedChild() {
  const [childList, setChildList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    parentService
      .getChildren()
      .then((list) => {
        setChildList(list);
        const saved = localStorage.getItem(KEY);
        const valid = list.find((c) => c._id === saved);
        setSelectedId(valid ? valid._id : list[0]?._id || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const select = useCallback((id) => {
    setSelectedId(id);
    localStorage.setItem(KEY, id);
  }, []);

  return { childList, selectedId, select, loading, error };
}
