import { motion } from "framer-motion";
import { type Dispatch, type SetStateAction } from "react";
import { cn } from "~/lib/utils";
import { type Tab } from "./NavbarContainer";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props {
  selectedTab: Tab;
  setSelectedTab: Dispatch<SetStateAction<Tab>>;
  tabs: Array<{ label: string; value: Tab }>;
  theme: "light" | "dark";
  handleLogout: () => void;
}

export default function Navbar({
  selectedTab,
  setSelectedTab,
  tabs,
  handleLogout,
}: Props) {
  return (
    <nav className="flex flex-row items-center justify-center bg-transparent p-4">
      <ul className="lex-row flex items-center justify-center gap-4 rounded-full p-2">
        {tabs.map((tab) => {
          return (
            <li
              key={tab.value}
              role="tab"
              className="relative flex items-center justify-center hover:cursor-pointer"
              onClick={() => setSelectedTab(tab.value)}
            >
              {tab.value === selectedTab && (
                <motion.div
                  layoutId="selectedTabPill"
                  className="z-1 absolute rounded-full bg-stone-700 px-4 py-2 !text-transparent backdrop-blur-md"
                >
                  {tab.label}
                </motion.div>
              )}
              <span
                className={cn(
                  "z-[2] p-2 text-white mix-blend-difference dark:mix-blend-normal",
                )}
              >
                {tab.label}
              </span>
            </li>
          );
        })}
      </ul>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="absolute bottom-4 left-4">
            <Button size="icon" variant="outline" onClick={handleLogout}>
              <LogOut size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Logout</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </nav>
  );
}
