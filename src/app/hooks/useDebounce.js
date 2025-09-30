// hooks/useDebounce.js
import { useState, useEffect } from 'react';

// Este hook recebe um valor e um tempo de atraso (delay)
export function useDebounce(value, delay) {
  // Estado para armazenar o valor "atrasado" (debounced)
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Cria um temporizador que só vai atualizar o estado
    // após o tempo de 'delay' ter passado sem que o 'value' mude.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Função de limpeza: se o 'value' mudar antes do tempo,
    // o temporizador anterior é limpo e um novo é criado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda novamente apenas se o valor ou o delay mudar

  return debouncedValue;
}