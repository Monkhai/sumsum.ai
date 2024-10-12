import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    // Add event listener for changes
    darkTheme.addEventListener("change", listener);

    // Set initial theme
    listener({ matches: darkTheme.matches } as MediaQueryListEvent);

    return () => {
      darkTheme.removeEventListener("change", listener);
    };
  }, []);

  return theme;
}
