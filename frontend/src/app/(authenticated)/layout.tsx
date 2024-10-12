"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Navbar from "~/components/Navbar";
import { auth } from "~/firebase/firebase";
import Providers from "~/Providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        void router.push("/login");
      } else {
        setIsLogged(true);
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLogged) return null;

  return (
    <main className="flex h-screen flex-col overflow-auto p-4">
      <Providers>
        <Navbar />
        {children}
      </Providers>
    </main>
  );
}
