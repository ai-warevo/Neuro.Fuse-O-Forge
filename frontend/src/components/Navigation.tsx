'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/' },
  { name: 'Visual Forge', href: '/image' },
  { name: 'Sonic Forge', href: '/sound' },
  { name: 'Lexi Forge', href: '/text' },
  { name: 'Layout Forge', href: '/ui' },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:block h-full">
      <ul className="flex items-center gap-1 h-full">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <li key={item.href} className="relative h-full flex items-center">
              <Link
                href={item.href}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 group
                  ${isActive 
                    ? 'text-brand-blue' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
              >
                {/* 🛰️ Status Dot */}
                <div className="relative flex h-1.5 w-1.5">
                  {isActive && (
                    <motion.span 
                      layoutId="activeDotGlow"
                      className="absolute inset-0 rounded-full bg-brand-blue/40 blur-[2px]"
                    />
                  )}
                  <span className={`relative rounded-full h-1.5 w-1.5 border transition-colors duration-500
                    ${isActive 
                      ? 'bg-brand-blue border-brand-blue' 
                      : 'bg-transparent border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-400'
                    }`} 
                  />
                </div>
                
                {item.name}

                {/* ⚡ Sliding Indicator (Sits exactly on the bottom border) */}
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute -bottom-[21px] left-0 right-0 h-[3px] bg-brand-blue z-20"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  >
                    {/* Inner Glow for Dark Mode */}
                    <div className="absolute inset-0 blur-[4px] bg-brand-blue/50 hidden dark:block" />
                  </motion.div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
