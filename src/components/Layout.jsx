import { NavLink } from "react-router-dom";
import {
  Home, Plane, Hotel, Bus, Clock, Trophy, Users, Lock,
} from "lucide-react";

const nav = [
  { to: "/",            label: "Home",        icon: Home },
  { to: "/flights",     label: "Flights",     icon: Plane },
  { to: "/hotel",       label: "Hotel",       icon: Hotel },
  { to: "/transfers",   label: "Transfers",   icon: Bus },
  { to: "/teetimes",    label: "Tee Times",   icon: Clock },
  { to: "/scoreboard",  label: "Scoreboard",  icon: Trophy },
  { to: "/teams",       label: "Teams",       icon: Users },
  { to: "/admin",       label: "Admin",       icon: Lock },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
    isActive
      ? "bg-emerald-600 text-white shadow-md"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

const bottomClass = ({ isActive }) =>
  `flex flex-col items-center gap-0.5 py-2 px-1 text-xs font-medium transition-all ${
    isActive ? "text-emerald-600" : "text-slate-500"
  }`;

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <div className="text-2xl font-bold text-emerald-700">⛳ Golf Trip</div>
          <div className="text-xs text-slate-500 mt-0.5">Trip Dashboard</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          Algarve 2026
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around px-1 py-1 lg:hidden z-50">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={bottomClass}>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
