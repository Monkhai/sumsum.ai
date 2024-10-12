"use client";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";
import { auth } from "~/firebase/firebase";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = getAuth().currentUser;

  useLayoutEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        void router.push("/home");
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) {
    return null;
  }
  return <main>{children}</main>;
}
