import { useCallback, useEffect, useState } from "react";

/* Carga datos y los refresca solos cada `ms` milisegundos (y al volver a la pestaña). */
export function useLive(fetcher, ms = 5000) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let alive = true;
    const run = () =>
      fetcher()
        .then((data) => alive && setState({ data, loading: false, error: "" }))
        .catch((e) => alive && setState((s) => ({ ...s, loading: false, error: e.message })));

    run();
    const id = setInterval(run, ms);
    window.addEventListener("storage", run); // cambios hechos en otra pestaña (modo demo)
    document.addEventListener("visibilitychange", run);
    return () => {
      alive = false;
      clearInterval(id);
      window.removeEventListener("storage", run);
      document.removeEventListener("visibilitychange", run);
    };
  }, [fetcher, ms, tick]);

  return { ...state, reload };
}
