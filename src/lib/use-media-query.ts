"use client";

import { useEffect, useState } from "react";

export function useIsDesktop(breakpoint = 768): boolean {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${breakpoint}px)`);
    setIsDesktop(query.matches);

    function handleChange(event: MediaQueryListEvent) {
      setIsDesktop(event.matches);
    }

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isDesktop;
}
