import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Flame, 
  AlertCircle,
  Tag,
  Shuffle,
  GraduationCap
} from 'lucide-react';
import { 
  TheoryQuestion, 
  generateTheoryQuestion, 
  TheoryDifficulty,
  THEORY_DIFFICULTY_CONFIGS,
  TheoryDifficultyConfig
} from '../utils/theoryQuestionGenerator';
import { recordTheoryAttempt } from '../utils/storage';

interface TheoryQuizSectionProps {
  onOpenAiTutor: () => void;
  onSelectTheoryLesson?: (lessonId: string) => void;
}

export const TheoryQuizSection: React.FC<TheoryQuizSectionProps> = ({
  onOpenAiTutor
}) => {
  // Currently selected difficulty category
  const [selectedDifficulty, setSelectedDifficulty] = useState<TheoryDifficulty>('Beginner');

  // Track seen signatures so questions are NEVER recycled in the session
  const [seenSignatures, setSeenSignatures] = useState<string[]>([]);
  
  // Current active question
  const [question, setQuestion] = useState<TheoryQuestion>(() => {
    return generateTheoryQuestion('Beginner', []);
  });

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Practice session metrics
  const [stats, setStats] = useState({
    answered: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0
  });

  // Handle switching difficulty category
  const handleSelectDifficulty = (difficulty: TheoryDifficulty) => {
    if (difficulty === selectedDifficulty && !isSubmitted) return;

    setSelectedDifficulty(difficulty);
    const updatedSeen = [...seenSignatures, question.signature];
    setSeenSignatures(updatedSeen);

    // Immediately generate a brand-new question for the selected difficulty
    const nextQ = generateTheoryQuestion(difficulty, updatedSeen);
    setQuestion(nextQ);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setValidationWarning(null);
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedOptionId(optionId);
    setValidationWarning(null);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) {
      setValidationWarning('Please select an answer choice before submitting.');
      return;
    }

    if (isSubmitted) return;

    const isCorrect = selectedOptionId === question.correctOptionId;
    setIsSubmitted(true);
    setValidationWarning(null);

    const newStreak = isCorrect ? stats.streak + 1 : 0;
    recordTheoryAttempt(selectedDifficulty, isCorrect, newStreak);

    setStats(prev => {
      const newAnswered = prev.answered + 1;
      const newCorrect = prev.correct + (isCorrect ? 1 : 0);
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      return {
        answered: newAnswered,
        correct: newCorrect,
        streak: newStreak,
        bestStreak: newBestStreak
      };
    });
  };

  // Generate another unique question within the current category
  const handleNextQuestion = () => {
    const updatedSeen = [...seenSignatures, question.signature];
    setSeenSignatures(updatedSeen);

    const nextQ = generateTheoryQuestion(selectedDifficulty, updatedSeen);
    setQuestion(nextQ);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setValidationWarning(null);
  };

  // Difficulty badge styling
  const getDifficultyBadgeStyle = (diff: TheoryDifficulty) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Intro Accounting':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Intermediate Accounting 1':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'Intermediate Accounting 2':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const accuracyPct = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all space-y-0">
      {/* 1. Header & Live Session Stats */}
      <div className="p-4 sm:p-6 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                Theory Multiple-Choice Practice
              </span>
              <span className="text-[11px] text-slate-400">
                Aligned with Practice Categories
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Select Practice Difficulty Level
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Choose your preferred difficulty to continuously generate theory-related multiple-choice questions matching the corresponding journal entry practice categories.
            </p>
          </div>

          {/* Quick Generate New Question Button */}
          <button
            onClick={handleNextQuestion}
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0 active:scale-95"
            title={`Generate another unique question in ${selectedDifficulty}`}
          >
            <Shuffle className="w-4 h-4 text-amber-300" />
            <span>Generate New Question</span>
          </button>
        </div>

        {/* Live Session Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400">Answered:</span>
            <span className="font-bold text-white font-mono-num">{stats.answered}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400">Accuracy:</span>
            <span className="font-bold text-emerald-400 font-mono-num">{accuracyPct}%</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Streak:
            </span>
            <span className="font-bold text-amber-300 font-mono-num">{stats.streak}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-400" /> Best:
            </span>
            <span className="font-bold text-indigo-300 font-mono-num">{stats.bestStreak}</span>
          </div>
        </div>
      </div>

      {/* 2. Four Selectable Difficulty Cards (Matching Practice Tab Categories) */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Choose Difficulty Level:
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Active: <strong className="text-indigo-700 font-semibold">{selectedDifficulty}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {THEORY_DIFFICULTY_CONFIGS.map((cat: TheoryDifficultyConfig) => {
            const isSelected = selectedDifficulty === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectDifficulty(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                  isSelected
                    ? 'border-indigo-600 bg-white shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {cat.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-2">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {cat.topicsSummary.slice(0, 2).map((top, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium truncate max-w-full"
                    >
                      {top}
                    </span>
                  ))}
                  {cat.topicsSummary.length > 2 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{cat.topicsSummary.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Question Narrative & Multiple-Choice Interaction Area */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Meta badges: Topic & Active Difficulty */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              {question.topic}
            </span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getDifficultyBadgeStyle(
                question.difficulty
              )}`}
            >
              {question.difficultyBadge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">
              Generating in: <strong className="text-slate-800">{selectedDifficulty}</strong>
            </span>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {question.question}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Select the single best answer choice below.
          </p>
        </div>

        {/* Validation Warning Alert (if user tries submitting with no choice selected) */}
        {validationWarning && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{validationWarning}</span>
          </div>
        )}

        {/* Multiple Choice Options List */}
        <div className="space-y-3">
          {question.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === question.correctOptionId;

            // Determine styling based on state
            let containerStyle = 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/70 text-slate-800';
            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

            if (!isSubmitted) {
              if (isSelected) {
                containerStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20';
                badgeStyle = 'bg-indigo-600 text-white border-indigo-600';
              }
            } else {
              // After submission
              if (isCorrectOption) {
                containerStyle = 'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-medium ring-2 ring-emerald-500/20';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isCorrectOption) {
                containerStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-2 ring-rose-400/20';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                containerStyle = 'border-slate-200 bg-slate-50/50 text-slate-500 opacity-60';
                badgeStyle = 'bg-slate-200 text-slate-500 border-slate-200';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                disabled={isSubmitted}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 min-h-[52px] ${containerStyle} ${
                  isSubmitted ? 'cursor-default' : ''
                }`}
              >
                {/* Option Letter Indicator */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${badgeStyle}`}
                >
                  {isSubmitted && isCorrectOption ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : isSubmitted && isSelected && !isCorrectOption ? (
                    <XCircle className="w-4 h-4 text-white" />
                  ) : (
                    option.id
                  )}
                </span>

                {/* Option Text */}
                <div className="flex-1 text-xs sm:text-sm leading-relaxed pt-0.5">
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
            <button
              onClick={onOpenAiTutor}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Need theoretical explanation? Ask AI Professor</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Generate Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Feedback & Conceptual Explanation Card (Revealed after submission) */}
        {isSubmitted && (
          <div
            className={`rounded-xl border p-4 sm:p-5 space-y-3 animate-in fade-in duration-200 ${
              selectedOptionId === question.correctOptionId
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/80 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {selectedOptionId === question.correctOptionId ? (
                <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-rose-700" />
                </div>
              )}

              <div>
                <h4 className="font-bold text-sm sm:text-base leading-tight">
                  {selectedOptionId === question.correctOptionId
                    ? 'Correct! Excellent Accounting Analysis.'
                    : `Incorrect. The correct answer was (${question.correctOptionId}).`}
                </h4>
                <p className="text-xs opacity-80">
                  Study the theoretical rationale and CPA handbook standard below.
                </p>
              </div>
            </div>

            {/* Detailed Explanation */}
            <div className="p-3.5 bg-white/95 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed shadow-2xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Conceptual Rationale & Analysis</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {question.explanation}
              </p>
            </div>

            {/* CPA Reference Callout */}
            {question.cpaReference && (
              <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-slate-700">
                  CPA Handbook / IFRS Reference:
                </span>
                <span>{question.cpaReference}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
