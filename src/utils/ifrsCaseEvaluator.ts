import {
  IfrsCase,
  IfrsAccountingIssue,
  StudentCaseSubmission,
  StudentShortAnswerIssue,
  EvaluatedStudentIssue,
  MissedAccountingIssue,
  ModelIssueSolution,
  CaseEvaluationResult
} from '../types/ifrsCase';

/**
 * Checks if a submission is completely blank or empty.
 * If at least one field in any issue contains text, the submission is not blank.
 */
export function isSubmissionBlank(submission: StudentCaseSubmission): boolean {
  if (!submission || !submission.issues || submission.issues.length === 0) {
    return true;
  }

  const allBlank = submission.issues.every(issue => {
    const titleBlank = !issue.identifiedIssueTitle || issue.identifiedIssueTitle.trim().length === 0;
    const stdBlank = !issue.chosenStandard || issue.chosenStandard.trim().length === 0;
    const analysisBlank = !issue.analysisAndFacts || issue.analysisAndFacts.trim().length === 0;
    const recBlank = !issue.recommendation || issue.recommendation.trim().length === 0;
    const legacyRecBlank = !issue.recommendationAndImpact || issue.recommendationAndImpact.trim().length === 0;
    const userBlank = !issue.userImpact || issue.userImpact.trim().length === 0;
    return titleBlank && stdBlank && analysisBlank && (recBlank && legacyRecBlank) && userBlank;
  });

  return allBlank;
}

/**
 * Normalizes standard strings for matching (e.g., "ifrs 15", "ifrs15", "ias 38", etc.)
 */
function normalizeStandard(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Extracts key standard code from user input (e.g. returns "ifrs15" from "IFRS 15 - Revenue", "ias20" from "IAS 20")
 */
function extractStandardCode(input: string): string {
  const norm = normalizeStandard(input);
  const match = norm.match(/(ifrs\d+|ias\d+)/);
  if (match) return match[1];
  return norm;
}

/**
 * Standard keywords for semantic matching across all IFRS and IAS standards
 */
const ISSUE_KEYWORDS: Record<string, string[]> = {
  'IFRS 15': ['revenue', 'contract', 'customer', 'performance obligation', 'bundle', 'deposit', 'unearned', 'sasp', 'stand-alone', 'installation', 'maintenance'],
  'IAS 37': ['provision', 'contingent', 'litigation', 'lawsuit', 'probable', 'estimate', 'outflow', 'insurance', 'claim', 'present obligation'],
  'IAS 38': ['intangible', 'research', 'development', 'pirate', 'capitalize', 'feasibility', 'horizon', 'prototype', 'expense'],
  'IAS 36': ['impairment', 'recoverable', 'cgu', 'cash-generating', 'fvlcd', 'value in use', 'fair value', 'discounted', 'carrying amount'],
  'IFRS 16': ['lease', 'right-of-use', 'rou', 'liability', 'operating lease', 'off-balance', 'rent expense', 'present value', 'facility lease'],
  'IAS 2': ['inventory', 'nrv', 'net realizable value', 'lower of cost', 'lcnrv', 'lifo', 'fifo', 'write-down', 'cost of goods sold'],
  'IAS 1': ['covenant', 'breach', 'current', 'non-current', 'waiver', 'subsequent', 'reclassify', 'term loan', 'debt classification', 'presentation'],
  'IFRS 11': ['joint', 'arrangement', 'operation', 'venture', 'consortium', 'joint control', 'line-by-line', 'unincorporated', 'equity method'],
  'IAS 16': ['property', 'plant', 'equipment', 'ppe', 'component', 'depreciation', 'dismantling', 'restoration', 'decommissioning', 'useful life'],
  'IAS 20': ['government grant', 'grant', 'government assistance', 'forgivable', 'deferred grant', 'deferred income', 'clawback', 'net zero', 'emissions'],
  'IFRS 9': ['financial instrument', 'debenture', 'sppi', 'fvtpl', 'fvoci', 'amortized cost', 'transaction cost', 'conversion', 'fair value loss', 'credit loss'],
  'IAS 23': ['borrowing cost', 'qualifying asset', 'capitalization', 'construction loan', 'active construction', 'interest capitalization', 'finance cost'],
  'IFRS 5': ['held for sale', 'discontinued', 'cessation of depreciation', 'cease depreciation', 'lower of carrying', 'fvlcd', 'disposal group'],
  'IAS 10': ['subsequent event', 'adjusting event', 'non-adjusting', 'bankruptcy', 'reporting date', 'fire', 'casualty', 'insolvency'],
  'IFRS 2': ['share-based', 'stock option', 'vesting', 'grant-date', 'black-scholes', 'contributed surplus', 'compensation expense', 'equity-settled'],
  'IAS 40': ['investment property', 'rental property', 'fair value model', 'profit or loss', 'revaluation surplus', 'commercial tower', 'tenant']
};

/**
 * Evaluates a student's short-answer case submission against the hidden case issues.
 * Provides thorough CPA Canada-style feedback (C / RC / NC) covering Criteria, Recommendation, and User Impact.
 */
export function evaluateStudentCaseSubmission(
  caseData: IfrsCase,
  submission: StudentCaseSubmission
): CaseEvaluationResult {
  const evaluatedIssues: EvaluatedStudentIssue[] = [];
  const matchedExpectedIssueIds = new Set<string>();

  const expectedIssues = caseData.issues || [];
  let anyMissingRecommendation = false;
  let anyMissingUserImpact = false;

  // Evaluate each student issue
  for (const studentIssue of submission.issues) {
    const studentTitle = (studentIssue.identifiedIssueTitle || '').trim();
    const studentStd = (studentIssue.chosenStandard || '').trim();
    const studentSection = (studentIssue.handbookSection || '').trim();
    const studentAnalysis = (studentIssue.analysisAndFacts || '').trim();
    const studentRec = (studentIssue.recommendation || studentIssue.recommendationAndImpact || '').trim();
    const studentUser = (studentIssue.userImpact || '').trim();

    const studentCode = extractStandardCode(studentStd);
    const combinedStudentText = `${studentTitle} ${studentStd} ${studentSection} ${studentAnalysis} ${studentRec} ${studentUser}`.toLowerCase();

    // Find best matching expected issue
    let bestMatch: IfrsAccountingIssue | undefined;
    let highestScore = 0;

    for (const exp of expectedIssues) {
      let score = 0;
      const expCode = normalizeStandard(exp.standardCode);

      // Standard code match
      if (studentCode === expCode || studentStd.toLowerCase().includes(exp.standardCode.toLowerCase())) {
        score += 50;
      }

      // Keyword match from standard's topic and criteria
      const keywords = ISSUE_KEYWORDS[exp.standardCode] || [];
      for (const kw of keywords) {
        if (combinedStudentText.includes(kw.toLowerCase())) {
          score += 5;
        }
      }

      if (!matchedExpectedIssueIds.has(exp.id)) {
        score += 10;
      }

      if (score > highestScore && score >= 20) {
        highestScore = score;
        bestMatch = exp;
      }
    }

    if (bestMatch) {
      matchedExpectedIssueIds.add(bestMatch.id);

      const expCode = normalizeStandard(bestMatch.standardCode);
      const isStdCorrect = studentCode === expCode || studentStd.toLowerCase().includes(bestMatch.standardCode.toLowerCase());

      // Evaluate criteria analysis
      const criteriaKeywords = bestMatch.criteria.flatMap(c => [
        ...c.name.toLowerCase().split(/\s+/),
        ...c.description.toLowerCase().split(/\s+/).filter(w => w.length > 4)
      ]);
      const matchedCriteriaKw = criteriaKeywords.filter(kw => combinedStudentText.includes(kw));
      const hasCriteriaDepth = studentAnalysis.length > 80 && matchedCriteriaKw.length >= 2;

      // Evaluate Recommendation section independently
      const isRecBlank = studentRec.length === 0;
      if (isRecBlank) anyMissingRecommendation = true;

      const recKeywords = ['debit', 'credit', 'dr', 'cr', 'reclassify', 'reverse', 'write-down', 'expense', 'liability', 'income', 'adjust', 'recognize', 'derecognize', 'record', 'defer'];
      const matchedRecKw = recKeywords.filter(kw => studentRec.toLowerCase().includes(kw));
      const hasRecDepth = !isRecBlank && studentRec.length > 40 && matchedRecKw.length >= 1;

      // Evaluate User section independently
      const isUserBlank = studentUser.length === 0;
      if (isUserBlank) anyMissingUserImpact = true;

      const userKeywords = ['bank', 'lender', 'covenant', 'ratio', 'working capital', 'debt', 'equity', 'bonus', 'management', 'shareholder', 'investor', 'creditor', 'user', 'threshold', 'ebt', 'income', 'margin'];
      const matchedUserKw = userKeywords.filter(kw => studentUser.toLowerCase().includes(kw));
      const hasUserDepth = !isUserBlank && studentUser.length > 30 && matchedUserKw.length >= 1;

      // Determine CPA status
      let status: 'Competent' | 'Reaching Competent' | 'Not Competent' = 'Not Competent';
      if (isStdCorrect && hasCriteriaDepth && hasRecDepth && hasUserDepth) {
        status = 'Competent';
      } else if (isStdCorrect && (hasCriteriaDepth || (hasRecDepth && hasUserDepth))) {
        status = 'Reaching Competent';
      } else if (isStdCorrect || (hasCriteriaDepth && studentAnalysis.length > 50)) {
        status = 'Reaching Competent';
      } else {
        status = 'Not Competent';
      }

      // Feedback construction
      let feedback = '';
      if (isStdCorrect) {
        feedback += `Correctly identified that ${bestMatch.standardCode} (${bestMatch.standardName}) governs this issue. `;
      } else {
        feedback += `Selected standard "${studentStd || 'None'}", whereas this transaction is governed by ${bestMatch.standardCode} (${bestMatch.standardName}). ${bestMatch.guidanceHints.wrongStandardHint} `;
      }

      let criteriaAssessment = '';
      if (hasCriteriaDepth) {
        criteriaAssessment = `Good factual application. Your analysis appropriately examined the criteria of ${bestMatch.standardCode} against the transaction facts.`;
      } else if (studentAnalysis.length > 0) {
        criteriaAssessment = `Partial criteria analysis. Under CPA Canada standards, you must explicitly evaluate each requirement in ${bestMatch.handbookSection} using figures and terms from the case.`;
      } else {
        criteriaAssessment = `No criteria analysis provided. Under CPA Canada standards, you must assess the criteria of ${bestMatch.standardCode} directly against the case facts.`;
      }

      let recommendationAssessment = '';
      if (isRecBlank) {
        recommendationAssessment = 'Missing Recommendation: No recommendation was provided. Under CPA Canada case writing, you must provide a clear recommendation (e.g. required adjusting journal entries, balance sheet adjustments, or disclosures).';
      } else if (hasRecDepth) {
        recommendationAssessment = 'Strong recommendation: Provided clear accounting adjustments with appropriate quantification and operational rationale.';
      } else {
        recommendationAssessment = 'Recommendation could be more specific. Ensure you quantify exact adjusting journal entries (debits and credits) and specific balance sheet line items.';
      }

      let userImpactAssessment = '';
      if (isUserBlank) {
        userImpactAssessment = 'Missing User Impact Analysis: No explanation was provided regarding the impact on financial statement users. Under CPA Canada standards, you must assess how your recommendation affects users such as lenders monitoring bank debt covenants, shareholders, management bonus thresholds, or auditors.';
      } else if (hasUserDepth) {
        userImpactAssessment = 'Strong user impact analysis: Effectively evaluated the implications of the accounting adjustment on financial statement users (e.g., bank debt covenants and management incentive benchmarks).';
      } else {
        userImpactAssessment = 'Partial user impact: Deepen your analysis of how this adjustment affects specific financial statement users, particularly bank debt covenants (working capital, debt-to-equity) and management bonus targets.';
      }

      evaluatedIssues.push({
        studentIssueTitle: studentTitle || `Analysis of ${bestMatch.standardCode}`,
        matchedExpectedIssueId: bestMatch.id,
        chosenStandard: studentStd,
        expectedStandard: bestMatch.standardCode,
        standardCorrect: isStdCorrect,
        issueIdentifiedCorrectly: true,
        status,
        feedback: feedback.trim(),
        criteriaAssessment,
        recommendationAssessment,
        userImpactAssessment
      });
    } else {
      // Unmatched issue
      const isRecBlank = studentRec.length === 0;
      const isUserBlank = studentUser.length === 0;
      if (isRecBlank) anyMissingRecommendation = true;
      if (isUserBlank) anyMissingUserImpact = true;

      evaluatedIssues.push({
        studentIssueTitle: studentTitle || 'Additional Identified Issue',
        chosenStandard: studentStd,
        standardCorrect: false,
        issueIdentifiedCorrectly: false,
        status: 'Not Competent',
        feedback: `This issue does not correspond to one of the core technical accounting issues embedded in this case. Review the case facts and business transactions for material financial reporting errors under IFRS/IAS.`,
        criteriaAssessment: 'Could not match this analysis to an expected Assessment Opportunity in the case.',
        recommendationAssessment: isRecBlank
          ? 'Missing Recommendation: No recommendation provided.'
          : 'Ensure recommendations focus on the primary contentious transactions identified in the case narrative.',
        userImpactAssessment: isUserBlank
          ? 'Missing User Impact Analysis: No user impact explained.'
          : 'Tie user impact directly to the primary stakeholders named in the case.'
      });
    }
  }

  // Identify Missed Accounting Issues
  const missedIssues: MissedAccountingIssue[] = [];
  for (const exp of expectedIssues) {
    if (!matchedExpectedIssueIds.has(exp.id)) {
      const criteriaList = exp.criteria.map(c => c.name).join(' and ');
      const whatStronger = `A stronger response would have:\n` +
        `1. Identified the issue: Recognized that this transaction involves ${exp.title}.\n` +
        `2. Applied the standard: Cited ${exp.handbookSection}.\n` +
        `3. Analyzed criteria: Evaluated ${criteriaList} against the case facts.\n` +
        `4. Formulated a recommendation: Proposed the required accounting adjustment (${exp.modelRecommendation.accountingTreatment}).\n` +
        `5. Assessed user impact: Explained the impact on bank debt covenants (${exp.modelRecommendation.covenantOrBusinessImpact}) and executive bonus targets.`;

      missedIssues.push({
        title: exp.title,
        standard: exp.standardCode,
        handbookReference: exp.handbookSection,
        explanation: `The case required technical analysis of this transaction under ${exp.standardCode} (${exp.standardName}). Management's current accounting in the draft financial statements is non-compliant. ${exp.guidanceHints.missingIssueHint}`,
        whatStrongerResponseWouldHaveAddressed: whatStronger
      });
    }
  }

  // Model Solutions for all expected issues
  const modelSolutions: ModelIssueSolution[] = expectedIssues.map(exp => ({
    title: exp.title,
    standard: `${exp.standardCode} — ${exp.standardName}`,
    handbookReference: exp.handbookSection,
    criteriaAnalysis: exp.criteria.map(c => `• ${c.name} (${c.standardReference}): ${c.description}\n  Case Application: ${c.expectedCaseFact}`).join('\n\n'),
    recommendation: exp.modelRecommendation.accountingTreatment,
    journalEntry: exp.modelRecommendation.journalEntry,
    covenantImpact: exp.modelRecommendation.covenantOrBusinessImpact
  }));

  // Overall Score Calculation
  const totalExpected = Math.max(expectedIssues.length, 1);
  const competentCount = evaluatedIssues.filter(i => i.status === 'Competent').length;
  const rcCount = evaluatedIssues.filter(i => i.status === 'Reaching Competent').length;

  const rawScore = ((competentCount * 1.0 + rcCount * 0.5) / totalExpected) * 100;
  const overallScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let overallPerformance: 'Competent' | 'Reaching Competent' | 'Not Competent' = 'Not Competent';
  if (overallScore >= 75) {
    overallPerformance = 'Competent';
  } else if (overallScore >= 45) {
    overallPerformance = 'Reaching Competent';
  } else {
    overallPerformance = 'Not Competent';
  }

  // Strengths and Areas for Improvement
  const strengths: string[] = [];
  const areasForImprovement: string[] = [];

  if (competentCount > 0) {
    strengths.push(`Successfully demonstrated Competent analysis for ${competentCount} accounting issue(s).`);
  }
  if (evaluatedIssues.some(i => i.standardCorrect)) {
    strengths.push(`Accurately identified and applied the correct IFRS/IAS standard(s) for addressed transactions.`);
  }
  if (evaluatedIssues.some(i => i.userImpactAssessment.includes('Strong user impact'))) {
    strengths.push(`Effectively evaluated the impact of proposed accounting adjustments on financial statement users and bank debt covenants.`);
  }
  if (strengths.length === 0) {
    strengths.push(`Initiated case analysis and attempted technical evaluation.`);
  }

  if (anyMissingRecommendation) {
    areasForImprovement.push('Missing Recommendation: You submitted an issue without providing a recommendation. Always propose specific journal entries and financial statement adjustments.');
  }
  if (anyMissingUserImpact) {
    areasForImprovement.push('Missing User Impact: You submitted an issue without explaining the impact on financial statement users. In CPA Canada case writing, connecting recommendations to users (lenders, covenants, bonus targets) is essential.');
  }
  if (missedIssues.length > 0) {
    areasForImprovement.push(`Missed ${missedIssues.length} key accounting issue(s): ${missedIssues.map(m => m.standard).join(', ')}. Scrutinize all case facts and transactions for unadjusted items.`);
  }
  if (rcCount > 0 && !anyMissingRecommendation && !anyMissingUserImpact) {
    areasForImprovement.push(`Deepen criteria analysis by citing specific Handbook paragraph references and tying them directly to dates and figures.`);
  }
  if (areasForImprovement.length === 0) {
    areasForImprovement.push(`Continue practicing comprehensive cases to maintain speed and precision under timed exam conditions.`);
  }

  const summaryFeedback = overallPerformance === 'Competent'
    ? `Strong CPA Canada-level case response. You demonstrated a solid grasp of IFRS/IAS technical accounting, correctly identified key Assessment Opportunities, and formulated defensible recommendations with user impact.`
    : overallPerformance === 'Reaching Competent'
    ? `Promising start with good foundational knowledge. Note the areas where recommendations or user impact analyses were missing or need greater depth. Review the feedback and model solutions below.`
    : `Several material issues were missed or lacked technical depth. Ensure you provide both a concrete recommendation and an evaluation of the impact on financial statement users for every issue. Study the model solutions below.`;

  return sanitizeEvaluationFeedback({
    overallScore,
    overallPerformance,
    summaryFeedback,
    strengths,
    areasForImprovement,
    evaluatedIssues,
    missedIssues,
    modelSolutions
  });
}

/**
 * Strips any mentions of specific appendices (e.g. "Appendix I", "Appendix II", "in Appendix 3", etc.)
 * from feedback, explanations, and model answers so students must interpret case documents independently.
 */
export function sanitizeEvaluationFeedback(result: CaseEvaluationResult): CaseEvaluationResult {
  if (!result) return result;

  const sanitizeText = (text: string): string => {
    if (!text || typeof text !== 'string') return text || '';
    return text
      // Remove directions like "Review Appendix II regarding...", "Examine Appendix 3:"
      .replace(/(?:review|examine|check|consult|refer to|see|look at)\s+(?:the\s+)?appendix\s+[ivx\d]+(?:\s+regarding\s+|,\s*|\s*:\s*|\s+)/gi, '')
      // Remove phrases like "in Appendix II", "per Appendix III", "from Appendix 1"
      .replace(/(?:in|from|per|under|according to)\s+(?:the\s+)?appendix\s+[ivx\d]+/gi, 'in the case facts')
      // Remove references like "(Appendix II)" or "[Appendix 3]"
      .replace(/\(\s*appendix\s+[ivx\d]+\s*\)/gi, '')
      .replace(/\[\s*appendix\s+[ivx\d]+\s*\]/gi, '')
      // Remove bare "Appendix I:", "Appendix II -", "Appendix III"
      .replace(/\bappendix\s+[ivx\d]+(?:\s*[:\-–]\s*|\b)/gi, 'case facts')
      .replace(/\band appendices\b/gi, '')
      .replace(/\bthe appendices\b/gi, 'the case facts')
      .replace(/\ball case appendices\b/gi, 'all case facts')
      .replace(/\bappendices\b/gi, 'case facts')
      // Clean up whitespace / punctuation glitches
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+,/g, ',')
      .replace(/\s+\./g, '.')
      .replace(/\(\s*\)/g, '')
      .trim();
  };

  return {
    ...result,
    summaryFeedback: sanitizeText(result.summaryFeedback),
    strengths: (result.strengths || []).map(sanitizeText),
    areasForImprovement: (result.areasForImprovement || []).map(sanitizeText),
    evaluatedIssues: (result.evaluatedIssues || []).map(issue => ({
      ...issue,
      feedback: sanitizeText(issue.feedback),
      criteriaAssessment: sanitizeText(issue.criteriaAssessment),
      recommendationAssessment: sanitizeText(issue.recommendationAssessment),
      userImpactAssessment: sanitizeText(issue.userImpactAssessment)
    })),
    missedIssues: (result.missedIssues || []).map(missed => ({
      ...missed,
      explanation: sanitizeText(missed.explanation),
      whatStrongerResponseWouldHaveAddressed: sanitizeText(missed.whatStrongerResponseWouldHaveAddressed)
    })),
    modelSolutions: (result.modelSolutions || []).map(sol => ({
      ...sol,
      criteriaAnalysis: sanitizeText(sol.criteriaAnalysis),
      recommendation: sanitizeText(sol.recommendation),
      covenantImpact: sanitizeText(sol.covenantImpact)
    }))
  };
}
