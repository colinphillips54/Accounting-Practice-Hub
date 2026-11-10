import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  BookOpen,
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';
import { MistakeRecord } from '../types/accounting';
import { 
  loadCompletedScenarios, 
  loadMistakeLog, 
  loadTopicStats, 
  removeMistake, 
  clearAllProgress 
} from '../utils/storage';

interface ProgressViewProps {
  onGoToPracticeTopic: (topic: string) => void;
  onRefresh: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  onGoToPracticeTopic,
  onRefresh
}) => {
  const [completedScenarios, setCompletedScenarios] = useState(loadCompletedScenarios());
  const [mistakes, setMistakes] = useState(loadMistakeLog());
  const [topicStats, setTopicStats] = useState(loadTopicStats());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Overall calculations
  const totalAttempts = Object.values(topicStats).reduce((s, t) => s + t.totalAttempts, 0);
  const correctAttempts = Object.values(topicStats).reduce((s, t) => s + t.correctAttempts, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const handleRemoveMistake = (id: string) => {
    removeMistake(id);
    setMistakes(loadMistakeLog());
    onRefresh();
  };

  const handleClearAll = () => {
    clearAllProgress();
    setCompletedScenarios([]);
    setMistakes([]);
    setTopicStats({});
    setShowClearConfirm(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Review & Progress Section Heading */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-600" />
                Review & Progress
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Review & Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track your performance and identify areas for improvement.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Scenarios Mastered</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono-num">
            {completedScenarios.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Unique Transactions</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Practice Accuracy</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono-num">
            {totalAttempts > 0 ? `${overallAccuracy}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono-num">
            {correctAttempts} of {totalAttempts} Attempts Correct
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Topics Practiced</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono-num">
            {Object.keys(topicStats).length}
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            <span>Curriculum Areas</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Diagnostic Log</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono-num">
            {mistakes.length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Targeted Learning Traps</span>
          </div>
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Topic Mastery & Proficiency
            </h3>
            <p className="text-xs text-slate-500">
              Track your performance across all fundamental introductory accounting syllabus topics.
            </p>
          </div>
        </div>

        {Object.keys(topicStats).length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs sm:text-sm">
            No topic attempts recorded yet. Practice journal entries to see your topic breakdown!
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(topicStats).map(([topic, stat]) => {
              const pct = Math.round((stat.correctAttempts / stat.totalAttempts) * 100);
              return (
                <div key={topic} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="font-semibold text-xs sm:text-sm text-slate-900">
                      {topic}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 font-mono-num">
                        {stat.correctAttempts}/{stat.totalAttempts} ({pct}%)
                      </span>
                      <button
                        onClick={() => onGoToPracticeTopic(topic)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Practice</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mistake Log & Diagnostic Traps */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Mistake Log & Targeted Review</span>
            </h3>
            <p className="text-xs text-slate-500">
              Learn from your errors. Every mistake is diagnosed so you don't repeat it on your exams.
            </p>
          </div>

          {mistakes.length > 0 && (
            <button
              onClick={() => {
                mistakes.forEach(m => removeMistake(m.id));
                setMistakes([]);
                onRefresh();
              }}
              className="text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear Mistake Log
            </button>
          )}
        </div>

        {mistakes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-lg text-slate-500 text-xs sm:text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">Your Mistake Log is Empty!</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Great job! When you make an error during journal entry practice, it will be logged here with targeted feedback.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mistakes.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                      {m.topic}
                    </span>
                    <span className="font-bold text-slate-900">{m.scenarioTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono-num">
                      {new Date(m.timestamp).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleRemoveMistake(m.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                      title="Dismiss this mistake"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  <strong className="text-amber-900 block mb-0.5">Diagnostic Feedback:</strong>
                  {m.feedback}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 font-mono-num text-[11px] truncate max-w-md">
                    Expected: {m.correctSummary}
                  </span>
                  <button
                    onClick={() => onGoToPracticeTopic(m.topic)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Practice Topic</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset All Progress Options */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Reset Local Progress</h4>
          <p className="text-xs text-slate-500">
            Clear all saved scenarios, topic stats, and mistake logs stored in this browser session.
          </p>
        </div>

        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reset All Progress
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-rose-700 font-semibold">Are you sure?</span>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            >
              Yes, Reset Everything
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
