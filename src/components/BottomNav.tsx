import React from "react";
import { Home, Camera, Settings, User } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function BottomNav() {
  return (
    <nav aria-label="bottom-navigation" className="pointer-events-auto">
      <div className="fixed left-1/2 bottom-6 z-40 -translate-x-1/2">
        <div
          className="flex items-center gap-6 rounded-full px-5 py-3 shadow-sm"
          style={{
            background: "rgba(6,78,59,0.95)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 8px 30px rgba(6,78,59,0.12)",
            color: "white",
            minWidth: 320,
          }}
        >
          <Link to="/" className="grid place-items-center text-white opacity-95">
            <Home size={20} />
          </Link>
          <Link to="/scan" className="grid place-items-center text-white opacity-95">
            <Camera size={20} />
          </Link>
          <Link to="/settings" className="grid place-items-center text-white opacity-95">
            <Settings size={20} />
          </Link>
          <Link to="/profile" className="grid place-items-center text-white opacity-95">
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
