import React from 'react';
import { useDq } from '../context/DqContext';
import { 
  Home, 
  BookOpen, 
  Compass, 
  ClipboardCheck, 
  User, 
  Bot, 
  Sparkles, 
  Lightbulb
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { stats, activeTab, setActiveTab, setIsBuddyOpen } = useDq();

  const navItems = [
    { id: 'home', label: 'หน้าหลัก', icon: Home },
    { id: 'learn', label: '8 ทักษะ DQ', icon: BookOpen },
    { id: 'scenario', label: 'สถานการณ์จำลอง', icon: Compass },
    { id: 'check', label: 'ประเมิน DQ Check', icon: ClipboardCheck },
    { id: 'tips', label: 'รู้ทันโลกดิจิทัล', icon: Lightbulb },
    { id: 'profile', label: 'โปรไฟล์ & สถิติ', icon: User },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single element wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              DQ
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors">
              DQ SMART LIFE
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-sky-400 bg-sky-950/50 border border-sky-800/60 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions & XP indicator */}
        <div className="flex items-center gap-3">
          {/* User Name Chip / Profile Link */}
          <button
            onClick={() => setActiveTab('profile')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-850 hover:border-sky-800/60 border border-slate-800 rounded-lg text-xs transition-colors"
            title="ไปยังหน้าโปรไฟล์และเกียรติบัตร"
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-200 font-medium max-w-[110px] truncate">
              {stats.userName || 'โปรไฟล์'}
            </span>
          </button>

          {/* XP & Level Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Lv.{stats.level}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-mono tabular-nums">{stats.xp} XP</span>
          </div>

          {/* DQ Buddy AI Button */}
          <button
            onClick={() => setIsBuddyOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg shadow-md shadow-sky-600/25 transition-all hover:shadow-sky-500/40 active:scale-95"
            title="ปรึกษา AI ผู้ช่วยความฉลาดทางดิจิทัล"
          >
            <Bot className="w-4 h-4 animate-pulse" />
            <span className="whitespace-nowrap">ถาม DQ Buddy</span>
          </button>
        </div>

      </div>
    </header>
  );
};
