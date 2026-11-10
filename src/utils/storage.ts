import { MistakeRecord, ExamSubmission, MultiTransactionScenario } from '../types/accounting';

const STORAGE_KEYS = {
  COMPLETED_SCENARIOS: 'aph_completed_scenarios',
  MISTAKE_LOG: 'aph_mistake_log',
  TOPIC_STATS: 'aph_topic_stats',
  EXAM_SUBMISSIONS: 'aph_exam_submissions',
  ACTIVE_MULTI_CASE: 'aph_active_multi_case',
  GENERATED_CYCLE_CASES: 'aph_generated_cycle_cases',
  THEORY_STATS: 'aph_theory_stats',
  PRACTICE_DIFFICULTY_STATS: 'aph_practice_difficulty_stats',
  CYCLE_STATS: 'aph_cycle_stats',
  IFRS_CASE_RECORDS: 'aph_ifrs_case_records',
};

export interface TopicStat {
  totalAttempts: number;
  correctAttempts: number;
}

export interface TheoryDifficultyStat {
  totalAttempts: number;
  correctAttempts: number;
  bestStreak: number;
}

export interface PracticeDifficultyStat {
  totalAttempts: number;
  correctAttempts: number;
  completedCount: number;
}

export interface CycleCasePerformance {
  caseId: string;
  caseTitle: string;
  totalTransactions: number;
  completedTransactions: number;
  totalAttempts: number;
  correctAttempts: number;
  isCompleted: boolean;
  lastUpdated: string;
}

export interface IfrsCaseRecord {
  id: string;
  caseId: string;
  caseTitle: string;
  timestamp: string;
  overallScore: number;
  overallPerformance: 'Competent' | 'Reaching Competent' | 'Not Competent';
  issueIdentificationScore: number;
  standardsScore: number;
  analysisScore: number;
  recommendationsScore: number;
  userImplicationsScore: number;
  totalIssues: number;
  issuesCorrect: number;
}

// ==================== PRACTICE & TOPICS ====================

export function loadCompletedScenarios(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_SCENARIOS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCompletedScenario(id: string): void {
  try {
    const current = loadCompletedScenarios();
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem(STORAGE_KEYS.COMPLETED_SCENARIOS, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to save completed scenario:', e);
  }
}

export function loadMistakeLog(): MistakeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISTAKE_LOG);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMistake(mistake: MistakeRecord): void {
  try {
    const current = loadMistakeLog();
    // Keep newest first, limit to 50
    const updated = [mistake, ...current.filter(m => m.id !== mistake.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.MISTAKE_LOG, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save mistake:', e);
  }
}

export function removeMistake(id: string): void {
  try {
    const current = loadMistakeLog();
    const updated = current.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MISTAKE_LOG, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove mistake:', e);
  }
}

export function loadTopicStats(): Record<string, TopicStat> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOPIC_STATS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordTopicAttempt(topic: string, isCorrect: boolean): void {
  try {
    const stats = loadTopicStats();
    if (!stats[topic]) {
      stats[topic] = { totalAttempts: 0, correctAttempts: 0 };
    }
    stats[topic].totalAttempts += 1;
    if (isCorrect) {
      stats[topic].correctAttempts += 1;
    }
    localStorage.setItem(STORAGE_KEYS.TOPIC_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to record topic attempt:', e);
  }
}

// ==================== THEORY STATS ====================

export function loadTheoryStats(): Record<string, TheoryDifficultyStat> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEORY_STATS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordTheoryAttempt(difficulty: string, isCorrect: boolean, streak: number): void {
  try {
    const stats = loadTheoryStats();
    if (!stats[difficulty]) {
      stats[difficulty] = { totalAttempts: 0, correctAttempts: 0, bestStreak: 0 };
    }
    stats[difficulty].totalAttempts += 1;
    if (isCorrect) {
      stats[difficulty].correctAttempts += 1;
    }
    stats[difficulty].bestStreak = Math.max(stats[difficulty].bestStreak, streak);
    localStorage.setItem(STORAGE_KEYS.THEORY_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to record theory attempt:', e);
  }
}

// ==================== PRACTICE DIFFICULTY STATS ====================

export function loadPracticeDifficultyStats(): Record<string, PracticeDifficultyStat> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRACTICE_DIFFICULTY_STATS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordPracticeDifficultyAttempt(difficulty: string, isCorrect: boolean, isCompletedNow: boolean = false): void {
  try {
    const stats = loadPracticeDifficultyStats();
    if (!stats[difficulty]) {
      stats[difficulty] = { totalAttempts: 0, correctAttempts: 0, completedCount: 0 };
    }
    stats[difficulty].totalAttempts += 1;
    if (isCorrect) {
      stats[difficulty].correctAttempts += 1;
    }
    if (isCompletedNow) {
      stats[difficulty].completedCount += 1;
    }
    localStorage.setItem(STORAGE_KEYS.PRACTICE_DIFFICULTY_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to record practice difficulty attempt:', e);
  }
}

// ==================== CYCLE FLOW PERFORMANCE ====================

export function loadCycleStats(): Record<string, CycleCasePerformance> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CYCLE_STATS);
    const parsed: Record<string, CycleCasePerformance> = raw ? JSON.parse(raw) : {};
    
    // Check if there are active multi-cases in localStorage not yet in cycle stats
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${STORAGE_KEYS.ACTIVE_MULTI_CASE}_`)) {
        const caseId = key.replace(`${STORAGE_KEYS.ACTIVE_MULTI_CASE}_`, '');
        if (!parsed[caseId]) {
          try {
            const completedIndices: number[] = JSON.parse(localStorage.getItem(key) || '[]');
            if (completedIndices.length > 0) {
              parsed[caseId] = {
                caseId,
                caseTitle: caseId.replace(/[-_]/g, ' '),
                totalTransactions: Math.max(completedIndices.length, 6),
                completedTransactions: completedIndices.length,
                totalAttempts: completedIndices.length,
                correctAttempts: completedIndices.length,
                isCompleted: false,
                lastUpdated: new Date().toISOString()
              };
            }
          } catch {
            // Ignore parse errors on individual keys
          }
        }
      }
    }
    return parsed;
  } catch {
    return {};
  }
}

export function recordCycleAttempt(
  caseId: string,
  caseTitle: string,
  totalTransactions: number,
  isCorrect: boolean,
  completedCount: number
): void {
  try {
    const stats = loadCycleStats();
    if (!stats[caseId]) {
      stats[caseId] = {
        caseId,
        caseTitle,
        totalTransactions,
        completedTransactions: completedCount,
        totalAttempts: 0,
        correctAttempts: 0,
        isCompleted: completedCount >= totalTransactions,
        lastUpdated: new Date().toISOString()
      };
    }
    stats[caseId].totalAttempts += 1;
    if (isCorrect) {
      stats[caseId].correctAttempts += 1;
    }
    stats[caseId].completedTransactions = completedCount;
    if (completedCount >= totalTransactions) {
      stats[caseId].isCompleted = true;
    }
    stats[caseId].lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CYCLE_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to record cycle attempt:', e);
  }
}

export function markCycleCaseCompleted(caseId: string, caseTitle: string, totalTransactions: number): void {
  try {
    const stats = loadCycleStats();
    if (!stats[caseId]) {
      stats[caseId] = {
        caseId,
        caseTitle,
        totalTransactions,
        completedTransactions: totalTransactions,
        totalAttempts: totalTransactions,
        correctAttempts: totalTransactions,
        isCompleted: true,
        lastUpdated: new Date().toISOString()
      };
    } else {
      stats[caseId].completedTransactions = totalTransactions;
      stats[caseId].isCompleted = true;
      stats[caseId].lastUpdated = new Date().toISOString();
    }
    localStorage.setItem(STORAGE_KEYS.CYCLE_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to mark cycle case completed:', e);
  }
}

export function resetCycleCaseProgress(caseId: string): void {
  try {
    const stats = loadCycleStats();
    if (stats[caseId]) {
      stats[caseId].completedTransactions = 0;
      stats[caseId].isCompleted = false;
      stats[caseId].lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.CYCLE_STATS, JSON.stringify(stats));
    }
  } catch (e) {
    console.error('Failed to reset cycle case progress:', e);
  }
}

// ==================== IFRS CASE RECORDS ====================

export function loadIfrsCaseRecords(): IfrsCaseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.IFRS_CASE_RECORDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveIfrsCaseRecord(record: IfrsCaseRecord): void {
  try {
    const current = loadIfrsCaseRecords();
    const updated = [record, ...current.filter(r => r.id !== record.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.IFRS_CASE_RECORDS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save IFRS case record:', e);
  }
}

// ==================== MULTI-CASE UTILITIES ====================

export function loadExamSubmissions(): ExamSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExamSubmission(submission: ExamSubmission): void {
  try {
    const current = loadExamSubmissions();
    const updated = [submission, ...current].slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.EXAM_SUBMISSIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save exam submission:', e);
  }
}

export function loadMultiCaseProgress(caseId: string): number[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_MULTI_CASE}_${caseId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMultiCaseProgress(caseId: string, completedIndices: number[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.ACTIVE_MULTI_CASE}_${caseId}`, JSON.stringify(completedIndices));
  } catch (e) {
    console.error('Failed to save multi case progress:', e);
  }
}

export function loadGeneratedCycleCases(): MultiTransactionScenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GENERATED_CYCLE_CASES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGeneratedCycleCases(cases: MultiTransactionScenario[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GENERATED_CYCLE_CASES, JSON.stringify(cases));
  } catch (e) {
    console.error('Failed to save generated cycle cases:', e);
  }
}

// ==================== RESET ====================

export function clearAllProgress(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(k => {
      localStorage.removeItem(k);
    });
    // Remove all aph_ keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('aph_')) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error('Failed to clear progress:', e);
  }
}
