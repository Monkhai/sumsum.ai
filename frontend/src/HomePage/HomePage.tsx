import { useSearchParams } from "next/navigation";
import NotesPage from "./components/NotesPage";
import SummeriesPage from "./components/SummeriesPage";

export default function HomePage() {
  const searchParams = useSearchParams().get("tab");

  if (searchParams === "notes") {
    return <NotesPage />;
  }

  if (searchParams === "summeries") {
    return <SummeriesPage />;
  }
  return <div>test</div>;
}
