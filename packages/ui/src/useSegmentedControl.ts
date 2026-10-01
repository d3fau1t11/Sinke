import { useState, useCallback } from 'react';

export function useSegmentedControl<T>(initialValue: T) {
  const [selectedValue, setSelectedValue] = useState<T>(initialValue);

  const handleChange = useCallback((value: T) => {
    setSelectedValue(value);
  }, []);

  return {
    selectedValue,
    setSelectedValue: handleChange,
  };
}