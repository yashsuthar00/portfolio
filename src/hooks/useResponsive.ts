"use client";

import { useState, useEffect } from "react";
import { ResponsiveState } from "@/types";

interface UseResponsiveReturn {
  responsive: ResponsiveState;
  setActivePanel: (panel: "terminal" | "card" | "both") => void;
  handleSwipe: (direction: "up" | "down" | "left" | "right") => void;
}

const useResponsive = (): UseResponsiveReturn => {
  const [responsive, setResponsive] = useState<ResponsiveState>({
    isMobile: false,
    activePanel: "both",
    swipeDirection: "vertical",
  });

  useEffect(() => {
    const checkIsMobile = (): void => {
      const isMobile = window.innerWidth < 768;
      setResponsive(prev => ({
        ...prev,
        isMobile,
        activePanel: isMobile ? "terminal" : "both",
      }));
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const setActivePanel = (panel: "terminal" | "card" | "both"): void => {
    setResponsive(prev => ({
      ...prev,
      activePanel: panel,
    }));
  };

  const handleSwipe = (direction: "up" | "down" | "left" | "right"): void => {
    if (!responsive.isMobile) return;

    if (direction === "up" && responsive.activePanel === "terminal") {
      setActivePanel("card");
    } else if (direction === "down" && responsive.activePanel === "card") {
      setActivePanel("terminal");
    }
  };

  return {
    responsive,
    setActivePanel,
    handleSwipe,
  };
};

export default useResponsive;
