import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground"
    >
      <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
      You're offline — the app still works, saved squares and sharing stay available.
    </div>
  );
}