"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import useTheme from "~/lib/useTheme";
import Navbar from "./Navbar";

export type Tab = "notes" | "summeries";

const tabs: Array<{ label: string; value: Tab }> = [
  { label: "Notes", value: "notes" },
  { label: "Summaries", value: "summeries" },
];

export default function NavbarContainer() {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = React.useState<Tab>(
    () => (searchParams.get("tab") as Tab) || "notes",
  );
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("tab", selectedTab);
    const tab = newParams.get("tab") as Tab;

    if (tab) {
      router.push(pathname + "?tab=" + tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  return (
    <Navbar
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      tabs={tabs}
      theme={theme}
    />
  );
}
