import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { HomeHeroView } from './components/HomeHeroView';
import { SinglePracticeView } from './components/SinglePracticeView';
import { AccountingCycleView } from './components/AccountingCycleView';
import { ApplicationOfIfrsView } from './components/ApplicationOfIfrsView';
import { LearnAccountingView } from './components/LearnAccountingView';
import { ProgressView } from './components/ProgressView';
import { AiTutorModal } from './components/AiTutorModal';
import { AccountingScenario, JournalEntryLine } from './types/accounting';
import { loadCompletedScenarios, loadTopicStats } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [completedCount, setCompletedCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  // AI Tutor modal state
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [tutorContextScenario, setTutorContextScenario] = useState<AccountingScenario | null>(null);
  const [tutorContextUserLines, setTutorContextUserLines] = useState<JournalEntryLine[] | undefined>();
  const [tutorContextCorrectLines, setTutorContextCorrectLines] = useState<any>();

  // Practice view topic filter when redirected from Learn or Progress
  const [practiceTopicFilter, setPracticeTopicFilter] = useState<any>(undefined);

  const refreshStats = () => {
    const completed = loadCompletedScenarios();
    setCompletedCount(completed.length);

    // Calculate streak from recent activity if any
    const stats = loadTopicStats();
    let correct = 0;
    Object.values(stats).forEach(s => {
      correct += s.correctAttempts;
    });
    setStreakCount(correct);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleOpenAiTutorWithContext = (
    scenario: AccountingScenario,
    userLines: JournalEntryLine[],
    correctLines: any
  ) => {
    setTutorContextScenario(scenario);
    setTutorContextUserLines(userLines);
    setTutorContextCorrectLines(correctLines);
    setIsAiTutorOpen(true);
  };

  const handleOpenGeneralAiTutor = () => {
    setTutorContextScenario(null);
    setTutorContextUserLines(undefined);
    setTutorContextCorrectLines(undefined);
    setIsAiTutorOpen(true);
  };

  const handleGoToPracticeTopic = (topic: string) => {
    setPracticeTopicFilter(topic);
    setActiveTab('practice');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAiTutor={handleOpenGeneralAiTutor}
        completedCount={completedCount}
        streakCount={streakCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeHeroView
            onNavigate={setActiveTab}
            onQuickPractice={() => setActiveTab('practice')}
            completedCount={completedCount}
          />
        )}

        {activeTab === 'practice' && (
          <SinglePracticeView
            onOpenAiTutorWithContext={handleOpenAiTutorWithContext}
            onRefreshStats={refreshStats}
            initialTopic={practiceTopicFilter}
          />
        )}

        {activeTab === 'cycle' && (
          <AccountingCycleView
            onOpenAiTutorWithContext={handleOpenAiTutorWithContext}
          />
        )}

        {activeTab === 'ifrs' && (
          <ApplicationOfIfrsView
            onOpenAiTutorWithContext={handleOpenAiTutorWithContext}
          />
        )}

        {activeTab === 'learn' && (
          <LearnAccountingView
            onOpenAiTutor={handleOpenGeneralAiTutor}
            onGoToPracticeTopic={handleGoToPracticeTopic}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            onGoToPracticeTopic={handleGoToPracticeTopic}
            onRefresh={refreshStats}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Accounting Practice Hub</span>
            <span>·</span>
            <span>Comprehensive Financial Accounting Practice Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>All business entities and financial data are fictional</span>
            <span>·</span>
            <span>Canadian Accounting Standards (IFRS & ASPE) Aligned</span>
          </div>
        </div>
      </footer>

      {/* Socratic AI Tutor Modal */}
      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        contextScenario={tutorContextScenario}
        contextUserLines={tutorContextUserLines}
        contextCorrectLines={tutorContextCorrectLines}
      />
    </div>
  );
}
