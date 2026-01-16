"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./output.css";
import OutputLayout from "@/components/output/OutputLayout";

export default function OutputPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  /* ============================
     AUTH CHECK (SAME AS EXAM)
     ============================ */
  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (!data.authenticated || data.expired) {
          alert("Please sign in to view your schedule.");
          router.replace("/");
        } else {
          setAuthenticated(true);
        }
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  /* 🔒 BLOCK RENDER UNTIL AUTH CHECK */
  if (checkingAuth) return null;
  if (!authenticated) return null;

  return <OutputLayout />;
}
