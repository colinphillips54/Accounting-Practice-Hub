import { MistakeRecord, ExamSubmission, MultiTransactionScenario } from '../types/accounting';

const STORAGE_KEYS = {
  COMPLETED_SCENARIOS: 'aph_completed_scenarios',
  MISTAKE_LOG: 'aph_mistake_log',
  TOPIC_STATS: 'aph_topic_stats',
  EXAM_SUBMISSIONS: 'aph_exam_submissions',
  ACTIVE_MULTI_CASE: 'aph_active_multi_case',
  GENERATED_CYCLE_CASES: 'aph_generated_cycle_cases',
};

export interface TopicStat {
  totalAttempts: number;
  correctAttempts: number;
}

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

export function clearAllProgress(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(k => {
      localStorage.removeItem(k);
    });
    // Remove multi case keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('aph_')) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error('Failed to clear progress:', e);
  }
}
