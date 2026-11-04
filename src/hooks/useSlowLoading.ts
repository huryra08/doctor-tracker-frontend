"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when `loading` has been true for longer than `delay` ms.
 * Used to show a "waking up the server" message on the free Render plan.
 */
export function useSlowLoading(loading: boolean, delay = 4000) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loading) return;
    // State is set inside the timer callback, not in the effect body.
    const timer = setTimeout(() => setTimedOut(true), delay);
    return () => {
      clearTimeout(timer);
      setTimedOut(false);
    };
  }, [loading, delay]);

  return loading && timedOut;
}