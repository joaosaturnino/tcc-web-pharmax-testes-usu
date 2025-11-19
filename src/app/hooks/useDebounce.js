import { useState, useEffect } from 'react';

/**
 * Hook customizado que aplica "debounce" a um valor.
 * @param {any} value - O valor que você quer aplicar debounce.
 * @param {number} delay - O tempo em milissegundos (ex: 300).
 * @returns {any} - O valor "debounced".
 */
export function useDebounce(value, delay) {
  // Estado para o valor "debounced"
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Cria um timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar (ou o componente desmontar)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Só re-executa se o valor ou o delay mudar

  return debouncedValue;
}