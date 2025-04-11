import React from "react";
import { User } from "@supabase/supabase-js";
import { User as UserIcon, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";

interface UserMenuProps {
  user: User | null;
  onShowAuth: () => void;
}

export default function UserMenu({ user, onShowAuth }: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Button variant="outline" className="w-full" onClick={onShowAuth}>
        <UserIcon className="h-4 w-4 mr-2" />
        Se connecter
      </Button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <UserIcon className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium truncate">{user.email}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => {
              supabase.auth.signOut();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
