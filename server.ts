import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  buildGeminiTutorPrompt,
  generateEducationalExplanation,
  TutorContext
} from './src/utils/tutorEngine.ts';
import {
  evaluateStudentCaseSubmission,
  isSubmissionBlank,
  sanitizeEvaluationFeedback
} from './src/utils/ifrsCaseEvaluator.ts';
import { generateCycleCase } from './src/utils/cycleCaseGenerator.ts';
import { generateRandomIfrsCase } from './src/utils/ifrsCaseGenerator.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper function to invoke Gemini model with timeout
async function generateWithTimeout(
  ai: GoogleGenAI,
  modelName: string,
  prompt: string,
  timeoutMs: number
): Promise<string> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms on model ${modelName}`)), timeoutMs)
  );

  const apiPromise = ai.models.generateContent({
    model: modelName,
    contents: prompt
  }).then(res => {
    const text = res.text?.trim();
    if (!text) throw new Error(`Empty response from ${modelName}`);
    return text;
  });

  return Promise.race([apiPromise, timeoutPromise]);
}

// Socratic Accounting AI Tutor API
app.post('/api/ai-tutor', async (req, res) => {
  const {
    question = '',
    scenarioTitle,
    scenarioNarrative,
    scenarioTopic,
    companyName,
    scenarioContext,
    userEntry,
    correctEntry
  } = req.body || {};

  // Build structured context
  const tutorContext: TutorContext = {
    question: String(question).trim(),
    scenarioTitle: scenarioTitle || (typeof scenarioContext === 'string' ? scenarioContext.split(':')[0] : undefined),
    scenarioNarrative: scenarioNarrative || (typeof scenarioContext === 'string' && scenarioContext.includes(':') ? scenarioContext.split(':').slice(1).join(':').trim() : scenarioContext),
    scenarioTopic,
    companyName,
    userEntry,
    correctEntry
  };

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = buildGeminiTutorPrompt(tutorContext);

      // Attempt primary model: gemini-3.8-flash (7 second timeout)
      try {
        const text = await generateWithTimeout(ai, 'gemini-3.8-flash', prompt, 7000);
        return res.json({
          reply: text,
          isFallback: false,
          model: 'gemini-3.8-flash'
        });
      } catch (primaryErr: any) {
        console.warn('Primary model gemini-3.8-flash unavailable, attempting fast fallback gemini-3.1-flash-lite:', primaryErr?.message);
        
        // Fast fallback model: gemini-3.1-flash-lite (7 second timeout)
        try {
          const fallbackText = await generateWithTimeout(ai, 'gemini-3.1-flash-lite', prompt, 7000);
          return res.json({
            reply: fallbackText,
            isFallback: false,
            model: 'gemini-3.1-flash-lite'
          });
        } catch (secondaryErr: any) {
          console.warn('Secondary model gemini-3.1-flash-lite also unavailable:', secondaryErr?.message);
        }
      }
    } catch (apiInitErr) {
      console.error('Error initializing Gemini client:', apiInitErr);
    }
  }

  // Domain-specific Socratic explanation engine
  // Generates a comprehensive, tailored, educational answer under Canadian standards
  const educationalReply = generateEducationalExplanation(tutorContext);
  return res.json({
    reply: educationalReply,
    isFallback: false,
    engine: 'socratic-canadian-accounting'
  });
});

// CPA Canada IFRS Case Evaluation API
app.post('/api/evaluate-ifrs-case', async (req, res) => {
  const { caseData, submission } = req.body || {};

  if (!submission || isSubmissionBlank(submission)) {
    return res.status(400).json({
      error: 'Please enter your analysis before submitting. Blank or empty submissions cannot be evaluated.',
      isBlank: true
    });
  }

  if (!caseData || !caseData.issues) {
    return res.status(400).json({ error: 'Missing case data' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert CPA Canada National Marking Centre senior evaluator for the Common Final Examination (CFE).
Evaluate the following student short-answer case response against the expected IFRS technical issues.

Case Information:
Company: ${caseData.companyName} (${caseData.industry})
Reporting Framework: Part I CPA Canada Handbook (IFRS)

Case Expected Issues:
${JSON.stringify(caseData.issues.map((i: any) => ({
  title: i.title,
  standard: i.standardCode,
  handbookSection: i.handbookSection,
  criteria: i.criteria.map((c: any) => c.name),
  recommendation: i.modelRecommendation.accountingTreatment
})), null, 2)}

Student Submission:
${JSON.stringify(submission.issues, null, 2)}

Instructions:
1. Student submissions have separate 'recommendation' and 'userImpact' fields. Evaluate both independently. If either is missing or blank, identify it explicitly in recommendationAssessment or userImpactAssessment and list it in areasForImprovement.
2. ZERO-APPENDIX DIRECTIVES: DO NOT mention, identify, cite, or direct students to specific appendices (e.g. never say "Appendix I", "Appendix II", "refer to Appendix 3", etc.). Focus strictly on the underlying transaction facts, accounting standards, handbook criteria, and recommendations without citing appendix numbers or names.
3. Return ONLY valid JSON adhering strictly to this schema:
{
  "overallScore": number (0-100),
  "overallPerformance": "Competent" | "Reaching Competent" | "Not Competent",
  "summaryFeedback": string,
  "strengths": string[],
  "areasForImprovement": string[],
  "evaluatedIssues": [
    {
      "studentIssueTitle": string,
      "chosenStandard": string,
      "expectedStandard": string,
      "standardCorrect": boolean,
      "issueIdentifiedCorrectly": boolean,
      "status": "Competent" | "Reaching Competent" | "Not Competent",
      "feedback": string,
      "criteriaAssessment": string,
      "recommendationAssessment": string,
      "userImpactAssessment": string
    }
  ],
  "missedIssues": [
    {
      "title": string,
      "standard": string,
      "handbookReference": string,
      "explanation": string,
      "whatStrongerResponseWouldHaveAddressed": string
    }
  ],
  "modelSolutions": [
    {
      "title": string,
      "standard": string,
      "handbookReference": string,
      "criteriaAnalysis": string,
      "recommendation": string,
      "journalEntry": string,
      "covenantImpact": string
    }
  ]
}
Do not wrap in markdown or backticks. Return raw JSON only.`;

      try {
        const rawJson = await generateWithTimeout(ai, 'gemini-3.8-flash', prompt, 8000);
        const cleaned = rawJson.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        const sanitized = sanitizeEvaluationFeedback(parsed);
        return res.json(sanitized);
      } catch (geminiErr: any) {
        console.warn('Gemini case evaluation fallback triggered:', geminiErr?.message);
      }
    } catch (err: any) {
      console.warn('Gemini client error in case evaluation:', err?.message);
    }
  }

  // Fallback to deterministic Canadian Socratic evaluator
  const result = evaluateStudentCaseSubmission(caseData, submission);
  return res.json(result);
});

// Continuous Canadian Accounting Cycle Case Generator API
app.post('/api/generate-cycle-case', async (req, res) => {
  try {
    const { caseNumber = 3, previousCompanyNames = [] } = req.body || {};
    const generatedCase = generateCycleCase(Number(caseNumber) || 3, previousCompanyNames);
    return res.json({
      success: true,
      case: generatedCase
    });
  } catch (err: any) {
    console.error('Error generating cycle case:', err);
    return res.status(500).json({
      error: 'Failed to generate accounting cycle case',
      message: err?.message
    });
  }
});

// Continuous Canadian IFRS Practice Case Generator API
app.post('/api/generate-ifrs-case', async (req, res) => {
  try {
    const { previousCompanyNames = [] } = req.body || {};
    const generatedCase = generateRandomIfrsCase(previousCompanyNames);
    return res.json({
      success: true,
      case: generatedCase
    });
  } catch (err: any) {
    console.error('Error generating IFRS case:', err);
    return res.status(500).json({
      error: 'Failed to generate IFRS case',
      message: err?.message
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
