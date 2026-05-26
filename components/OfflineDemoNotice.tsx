"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { detectNetworkStatus } from "@/lib/networkStatus";

export function OfflineDemoNotice() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function refresh() {
      const status = await detectNetworkStatus();
      setMessage(status.mode === "online" ? "" : status.message);
    }

    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        {message}
      </div>
    </div>
  );
}
