import React from 'react';
import { DqProvider, useDq } from './context/DqContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { HomeDashboard } from './components/HomeDashboard';
import { LearningHub } from './components/LearningHub';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { DqCheckAssessment } from './components/DqCheckAssessment';
import { DqProfile } from './components/DqProfile';
import { KnowledgeTipsView } from './components/KnowledgeTipsView';
import { DqBuddyDrawer } from './components/DqBuddyDrawer';
import { SCIMATH_SOURCE } from './data/dqSkills';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useDq();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'learn' && <LearningHub />}
        {activeTab === 'scenario' && <ScenarioSimulator />}
        {activeTab === 'check' && <DqCheckAssessment />}
        {activeTab === 'profile' && <DqProfile />}
        {activeTab === 'tips' && <KnowledgeTipsView />}
      </main>

      {/* Global AI Assistant Drawer */}
      <DqBuddyDrawer />

      {/* Notification Toast Stream */}
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 py-10 pb-20 md:pb-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-white text-sm">DQ SMART LIFE</span>
              <span className="text-slate-600">·</span>
              <span className="text-sky-400 font-medium">ฉลาดใช้ ฉลาดคิด ฉลาดอยู่ในโลกดิจิทัล</span>
            </div>
            <p className="text-slate-400 text-xs">
              สื่อการเรียนรู้นวัตกรรมการศึกษาเพื่อพัฒนาทักษะความฉลาดทางดิจิทัล (Digital Intelligence: DQ) 8 ทักษะ
            </p>
            <p className="text-slate-400 text-[11px]">
              อ้างอิงเนื้อหาหลักจาก: {SCIMATH_SOURCE.organization} บทความ “{SCIMATH_SOURCE.articleTitle}” โดย {SCIMATH_SOURCE.author}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href={SCIMATH_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 flex items-center gap-1 transition-colors"
            >
              <span>คลังความรู้ SciMath สสวท.</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setActiveTab('tips')}
              className="hover:text-sky-400 transition-colors"
            >
              รู้ทันโลกดิจิทัล
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:text-sky-400 transition-colors"
            >
              เกียรติบัตรการเรียนรู้
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DqProvider>
      <AppContent />
    </DqProvider>
  );
}
