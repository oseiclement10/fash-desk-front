import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuthUser } from "@/contexts/auth/auth-context";

interface WelcomeBannerProps {
  showSeconds?: boolean;
}

const getGreeting = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
};

const initialsFromName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] ?? "")).toUpperCase();
};

export default function WelcomeBanner({ showSeconds = false }: WelcomeBannerProps) {
  const user = useAuthUser();
  const username = user?.name || "User";

  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, showSeconds ? 1000 : 1000);
    return () => clearInterval(id);
  }, [showSeconds]);

  const greeting = useMemo(() => getGreeting(now), [now]);

  const timeString = useMemo(() => {
    const opts: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      second: showSeconds ? "2-digit" : undefined,
      hour12: true,
      timeZone: "Africa/Accra",
    };
    return new Intl.DateTimeFormat(undefined, opts).format(now);
  }, [now, showSeconds]);

  const initials = initialsFromName(username);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full mx-auto mb-4 md:mb-6 bg-gradient-to-r from-white/70 to-white/50 dark:from-slate-800/70 dark:to-slate-800/50 rounded-xl shadow-sm p-3 sm:p-4 flex items-center gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold shadow-md">
            {initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white dark:ring-slate-800" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back</p>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">{username}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{greeting}</p>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/15  dark:bg-slate-700/60 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600 dark:text-slate-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.5 2a.75.75 0 01.75.75V4h5V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0117 6.75v6.5A2.75 2.75 0 0114.25 16h-8.5A2.75 2.75 0 013 13.25v-6.5A2.75 2.75 0 015.75 4H6V2.75A.75.75 0 016.5 2zM5.75 5a.25.25 0 00-.25.25V7h10V5.25a.25.25 0 00-.25-.25h-9.5zM4.5 8v5.25c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25V8h-11.25z" clipRule="evenodd" />
            </svg>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-100">{timeString}</div>
          </div>
          <div className="mt-0.5 text-[10px] text-primary">
            {Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Africa/Accra' }).format(now)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
