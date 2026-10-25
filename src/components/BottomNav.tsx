import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Shield,
  BookOpen,
  Compass,
  Menu
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/armour', label: 'Armour', icon: Shield },
    { to: '/study', label: 'Study', icon: BookOpen },
    { to: '/journey', label: 'Journey', icon: Compass },
    { to: '/more', label: 'More', icon: Menu }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0b132b]/95 backdrop-blur-lg border-t border-slate-800 safe-pb">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition text-[11px] font-medium ${
                  isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition ${
                      isActive ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
