import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSessionState] = useState(
    localStorage.getItem("email") ?? ""
  );

  useEffect(() => {
    const handleStorage = () => {
      setSessionState(localStorage.getItem("email") ?? "");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function setSession(newEmail: string) {
    localStorage.setItem("email", newEmail);
    window.dispatchEvent(new Event("storage"));
  }

  function clearSession() {
    localStorage.removeItem("email");
    window.dispatchEvent(new Event("storage"));
  }

  return { session, setSession, clearSession };
}
