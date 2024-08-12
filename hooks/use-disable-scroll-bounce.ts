import { useEffect } from "react";

export const useDisableScrollBounce = () => {
  /**
   * When other use has larger screen and they move cursor around a lot
   * It can trigger scroll bounce on this user's screen
   * This hook will disable scroll bounce on this user's screen
   */
  useEffect(() => {
    document.body.classList.add("overflow-hidden", "overscroll-none");
    return () => {
      document.body.classList.remove("overflow-hidden", "overscroll-none");
    };
  }, []);
};
