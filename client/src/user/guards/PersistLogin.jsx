import React, { useEffect, useState, useRef } from "react";
import { useAuthAdapter } from "../../auth/useAuthAdapter.js";

export default function PersistLogin({ children }) {
  const { refresh, loading } = useAuthAdapter();
  const [init, setInit] = useState(false);

  const attemptedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (attemptedRef.current) {
        setInit(true);
        return;
      }
      attemptedRef.current = true;
      try {
        await refresh();
      } finally {
        if (mounted) setInit(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  if (!init || loading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(180deg,#fffdf8_0%,#f5ebde_100%)] p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div
          className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#d4a373] border-t-transparent"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-[#6f5b4f]">Đang xác thực…</p>
      </div>
    );
  }
  return children;
}
