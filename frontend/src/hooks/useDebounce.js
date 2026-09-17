import { useState } from 'react';

export default function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  setTimeout(() => setV(value), delay);
  return v;
}
