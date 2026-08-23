import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Lesson Plan Generator Endpoint
app.post("/api/gemini/generate-lesson-plan", async (req, res) => {
  try {
    const {
      standard = "ધોરણ ૭",
      subject = "ગણિત",
      chapter = "પૂર્ણાંક સંખ્યાઓ",
      topic = "સંખ્યારેખા નિરૂપણ અને સરવાળા",
      planType = "single_period", // 'single_period' | 'weekly_block' | 'monthly_breakdown'
      pedagogicalFocus = "activity_based", // 'activity_based' | 'fln_remedial' | 'learning_outcomes' | 'lab_experiment'
      durationMinutes = 45,
      totalDays = 1,
      language = "gujarati",
      additionalInstructions = ""
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback template builder if no API key is provided
    if (!apiKey) {
      const fallbackResult = generateFallbackLessonPlan({
        standard,
        subject,
        chapter,
        topic,
        planType,
        pedagogicalFocus,
        durationMinutes,
        totalDays,
        language,
        additionalInstructions,
      });
      return res.json({
        success: true,
        data: fallbackResult,
        source: "curriculum_engine_fallback",
        note: "API Key not configured in environment. Generated using GCERT Gujarat Primary Curriculum Engine.",
      });
    }

    const ai = getAiClient();
    if (!ai) {
      throw new Error("Failed to initialize GoogleGenAI client");
    }

    const prompt = `
તમે ગુજરાત રાજ્ય પ્રાથમિક શિક્ષણ બોર્ડ (GCERT / SSA Gujarat) ના વરિષ્ઠ શૈક્ષણિક વિષય નિષ્ણાત (Pedagogical Curriculum Expert) છો.
નીચે આપેલી માહિતીના આધારે શિક્ષક માટે અત્યંત વ્યવસ્થિત, વિગતવાર, વર્ગખંડમાં અમલમાં મૂકી શકાય તેવું અને નિરીક્ષણ માટે આદર્શ 'પાઠ આયોજન (Structured Lesson Plan & Layout)' તૈયાર કરો:

[માહિતી]:
- ધોરણ (Grade): ${standard}
- વિષય (Subject): ${subject}
- પ્રકરણ / એકમ (Chapter): ${chapter}
- પેટા મુદ્દો / ટોપિક (Topic): ${topic}
- આયોજન પ્રકાર (Plan Type): ${planType === 'monthly_breakdown' ? 'માસિક પાઠ આયોજન (Monthly Breakdown with Daily Checklists)' : planType === 'weekly_block' ? 'સાપ્તાહિક બ્લોક પ્લાન (5-Day Weekly Unit Plan)' : 'વિગતવાર ૧-દિવસીય તાસ આયોજન (Detailed Single Period Plan)'}
- સમયગાળો: ${durationMinutes} મિનિટ (${totalDays} દિવસો)
- શિક્ષણ પદ્ધતિ ફોકસ: ${pedagogicalFocus}
- માધ્યમ: ગુજરાતી (GCERT માનક શબ્દાવલી)
- વધારાની સૂચનાઓ: ${additionalInstructions || 'કોઈ ખાસ નહીં'}

પાઠ આયોજનમાં આ મુદ્દાઓ ચોક્કસપણે સામેલ હોવા જોઈએ:
1. શીર્ષક અને ગુજરાતી/અંગ્રેજી નામ
2. માન્ય GCERT અધ્યયન નિષ્પત્તિઓ (Learning Outcomes - LO Codes જેમ કે M701, S603, G502)
3. સામાન્ય અને વિશિષ્ટ હેતુઓ (General & Specific Objectives)
4. પૂર્વજ્ઞાન ચકાસણી (Prerequisite Knowledge)
5. TLM / શૈક્ષણિક સાધન સામગ્રી (Flashcards, Charts, Real objects, Digital tools)
6. 5E પદ્ધતિ મુજબ તબક્કાવાર શિક્ષણ પ્રક્રિયા (Engagement, Exploration, Explanation, Elaboration, Evaluation)
7. દરેક તબક્કામાં શિક્ષક પ્રવૃત્તિ, વિદ્યાર્થી પ્રવૃત્તિ, શ્યામપાટ કાર્ય (Blackboard Work) અને ચેક કરી શકાય તેવા પેટા-કાર્યો (Sub-tasks)
8. રચનાત્મક મૂલ્યાંકન પ્રશ્નો (Formative Assessment Questions with expected answers)
9. FLN / પ્રજ્ઞા / નબળા વિદ્યાર્થીઓ માટે ઉપચારાત્મક (Remedial) કાર્ય અને તેજસ્વી બાળકો માટે વિસ્તરણ
10. ગૃહકાર્ય (Homework) અને શિક્ષકની સ્વ-મૂલ્યાંકન નોંધ

જો planType 'weekly_block' કે 'monthly_breakdown' હોય તો ક્રમબદ્ધ 'dailyActivities' (દિવસ ૧, ૨, ૩...) નું આયોજન આપો.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Gujarat Primary School (GCERT/NCERT) master teacher and curriculum planner. Generate highly detailed, structured, pedagogically sound lesson plans in Gujarati with clear steps, TLM, LO codes, and checkboxes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "મુખ્ય શીર્ષક" },
            englishTitle: { type: Type.STRING, description: "English title" },
            standard: { type: Type.STRING, description: "ધોરણ" },
            subject: { type: Type.STRING, description: "વિષય" },
            unitName: { type: Type.STRING, description: "એકમ/પ્રકરણ નામ" },
            durationMinutes: { type: Type.INTEGER, description: "કુલ મિનિટ" },
            totalPeriods: { type: Type.INTEGER, description: "કુલ તાસ" },
            planType: { type: Type.STRING, description: "single_period | weekly_block | monthly_breakdown" },
            learningOutcomes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING, description: "LO Code e.g. M701" },
                  description: { type: Type.STRING, description: "અધ્યયન નિષ્પત્તિ વર્ણન" },
                },
                required: ["code", "description"],
              },
            },
            generalObjectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "સામાન્ય હેતુઓ",
            },
            prerequisites: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "પૂર્વજ્ઞાન",
            },
            tlmAndResources: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "TLM અને સાધન સામગ્રી",
            },
            pedagogicalSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, description: "તબક્કો e.g. પ્રસ્તાવના / સંકલ્પના સ્પષ્ટીકરણ / મહાવરો" },
                  durationMin: { type: Type.INTEGER, description: "સમય મિનિટમાં" },
                  teacherActivity: { type: Type.STRING, description: "શિક્ષકની પ્રવૃત્તિ" },
                  studentActivity: { type: Type.STRING, description: "વિદ્યાર્થીઓની પ્રવૃત્તિ" },
                  blackboardWork: { type: Type.STRING, description: "શ્યામપાટ કાર્ય" },
                  subTasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "ચેક કરી શકાય તેવા પેટા-કાર્યો",
                  },
                },
                required: ["phase", "durationMin", "teacherActivity", "studentActivity", "subTasks"],
              },
            },
            formativeAssessment: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  type: { type: Type.STRING },
                  expectedAnswer: { type: Type.STRING },
                },
                required: ["question", "expectedAnswer"],
              },
            },
            flnAndRemedialGuidance: {
              type: Type.OBJECT,
              properties: {
                flnLevel: { type: Type.STRING },
                remedialStrategy: { type: Type.STRING },
                extensionForAdvanced: { type: Type.STRING },
              },
              required: ["flnLevel", "remedialStrategy", "extensionForAdvanced"],
            },
            homeworkAndAssignment: { type: Type.STRING, description: "ગૃહકાર્ય અને પ્રોજેક્ટ વર્ક" },
            teacherReflectiveNotes: { type: Type.STRING, description: "શિક્ષકની સ્વ-મૂલ્યાંકન નોંધ" },
            dailyActivities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  learningOutcome: { type: Type.STRING },
                  teachingActivity: { type: Type.STRING },
                  tlmUsed: { type: Type.STRING },
                  assessmentMethod: { type: Type.STRING },
                  homework: { type: Type.STRING },
                  subTasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["dayNumber", "title", "topic", "teachingActivity", "subTasks"],
              },
            },
          },
          required: [
            "title",
            "standard",
            "subject",
            "unitName",
            "learningOutcomes",
            "generalObjectives",
            "prerequisites",
            "tlmAndResources",
            "pedagogicalSteps",
            "formativeAssessment",
            "flnAndRemedialGuidance",
            "homeworkAndAssignment",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsedData,
      source: "gemini_ai",
    });
  } catch (error: any) {
    console.error("Gemini Lesson Plan Generation Error:", error);
    // Fallback gracefully so the teacher never gets a broken screen
    const { standard, subject, chapter, topic, planType, pedagogicalFocus, durationMinutes, totalDays, language, additionalInstructions } = req.body || {};
    const fallback = generateFallbackLessonPlan({
      standard: standard || "ધોરણ ૭",
      subject: subject || "ગણિત",
      chapter: chapter || "પૂર્ણાંક સંખ્યાઓ",
      topic: topic || "સંખ્યારેખા નિરૂપણ",
      planType: planType || "single_period",
      pedagogicalFocus: pedagogicalFocus || "activity_based",
      durationMinutes: durationMinutes || 45,
      totalDays: totalDays || 1,
      language: language || "gujarati",
      additionalInstructions: additionalInstructions || "",
    });

    return res.json({
      success: true,
      data: fallback,
      source: "curriculum_engine_fallback",
      errorInfo: error?.message || "AI API call returned fallback result",
    });
  }
});

// Comprehensive GCERT Gujarati Primary Curriculum Generator Fallback
function generateFallbackLessonPlan(params: any) {
  const {
    standard = "ધોરણ ૭",
    subject = "ગણિત",
    chapter = "પૂર્ણાંક સંખ્યાઓ",
    topic = "સંખ્યારેખા નિરૂપણ અને સરવાળા",
    planType = "single_period",
    durationMinutes = 45,
    totalDays = 1,
  } = params;

  const isMath = subject.includes("ગણિત") || subject.toLowerCase().includes("math");
  const isScience = subject.includes("વિજ્ઞાન") || subject.toLowerCase().includes("science");
  const isLanguage = subject.includes("ગુજરાતી") || subject.includes("હિન્દી") || subject.includes("અંગ્રેજી") || subject.includes("સંસ્કૃત");
  const isSocial = subject.includes("સામાજિક") || subject.includes("પર્યાવરણ");

  let loPrefix = "M";
  if (isScience) loPrefix = "S";
  else if (isLanguage) loPrefix = "L";
  else if (isSocial) loPrefix = "SS";
  const gradeNum = standard.match(/\d+/) ? standard.match(/\d+/)![0] : "7";

  return {
    title: `${standard} ${subject} - ${chapter} (${topic})`,
    englishTitle: `${subject} (${standard}) - ${chapter}: ${topic}`,
    standard: standard,
    subject: subject,
    unitName: `પ્રકરણ: ${chapter}`,
    durationMinutes: Number(durationMinutes) || 45,
    totalPeriods: planType === "monthly_breakdown" ? 20 : planType === "weekly_block" ? 5 : 1,
    planType: planType,
    learningOutcomes: [
      {
        code: `${loPrefix}${gradeNum}01`,
        description: `વિદ્યાર્થીઓ ${chapter} અંતર્ગત ${topic} ની મૂળભૂત સંકલ્પના સમજે છે અને વ્યવહારિક ઉદાહરણો સાથે જોડે છે.`,
      },
      {
        code: `${loPrefix}${gradeNum}02`,
        description: `વિદ્યાર્થીઓ TLM અને વર્ગખંડ પ્રવૃત્તિ દ્વારા વિશ્લેષણ કરી પ્રશ્નોના જવાબો આપમેળે શોધે છે.`,
      },
      {
        code: `${loPrefix}${gradeNum}03`,
        description: `સ્વાધ્યાય અને દૈનિક જીવનના સંદર્ભમાં સંકલ્પનાનો પ્રત્યક્ષ ઉપયોગ કરે છે.`,
      },
    ],
    generalObjectives: [
      `વિદ્યાર્થીઓમાં ${subject} વિષય પ્રત્યે રસ અને જિજ્ઞાસાવૃત્તિ જાગૃત કરવી.`,
      `પ્રવૃત્તિ દ્વારા શિક્ષણ (Learning by Doing) ના સિદ્ધાંતને મૂર્તિમંત કરવો.`,
      `તાર્કિક વિચારણા અને સહયોગી અધ્યયન (Collaborative Learning) ને પ્રોત્સાહન આપવું.`,
    ],
    prerequisites: [
      `અગાઉના ધોરણમાં શીખેલ પાયાની સંકલ્પનાઓનું સ્મરણ.`,
      `દૈનિક જીવનના સાદા અનુભવો અને શબ્દભંડોળનું જ્ઞાન.`,
    ],
    tlmAndResources: [
      `વિષય પાઠ્યપુસ્તક (GCERT Text Book) અને સંદર્ભ સાહિત્ય`,
      `રંગીન ચાર્ટ પેપર / ફ્લેશકાર્ડ્સ અને પ્રવૃત્તિ કાર્ડ`,
      `શ્યામપાટ (Blackboard), ચોક-ડસ્ટર અને પોઇન્ટર`,
      `ડિજિટલ સંસાધન (DIKSHA QR Code / વિડીયો ક્લિપ)`,
      `મૂર્ત વસ્તુઓ / વર્ગખંડ મોડેલ્સ`,
    ],
    pedagogicalSteps: [
      {
        phase: "૧. પૂર્વજ્ઞાન & પ્રસ્તાવના (Engagement - Warm-up)",
        durationMin: 7,
        teacherActivity: `શિક્ષક રોજિંદા જીવન સાથે જોડાયેલ રસપ્રદ વાર્તા અથવા પ્રશ્નોત્તરી પૂછી વર્ગખંડનું ધ્યાન આકર્ષિત કરશે.`,
        studentActivity: `વિદ્યાર્થીઓ ઉત્સાહપૂર્વક જવાબો આપશે અને પોતાના અનુભવો વર્ગ સમક્ષ રજૂ કરશે.`,
        blackboardWork: `મુખ્ય શીર્ષક, તારીખ, ધોરણ અને પૂર્વજ્ઞાનના મુખ્ય કી-વર્ડ્સની નોંધ.`,
        subTasks: [
          "વિદ્યાર્થીઓનું પૂર્વજ્ઞાન ચકાસવું (Review previous knowledge)",
          "નવા એકમની ભૂમિકા બાંધવી અને જિજ્ઞાસા પ્રેરવી",
          "શ્યામપાટ પર પાઠનું નામ અને મુખ્ય હેતુ દર્શાવવો",
        ],
      },
      {
        phase: "૨. સંકલ્પના સ્પષ્ટીકરણ (Exploration & Explanation)",
        durationMin: 18,
        teacherActivity: `શિક્ષક TLM, ચાર્ટ અથવા પ્રયોગ/પ્રવૃત્તિ દ્વારા ${topic} ની વિગતવાર સમજ આપશે.`,
        studentActivity: `વિદ્યાર્થીઓ ધ્યાનપૂર્વક નિરીક્ષણ કરશે, નોંધપોથીમાં નોંધ કરશે અને શંકાઓ પૂછશે.`,
        blackboardWork: `સંકલ્પનાનું રેખાચિત્ર, નિયમો, સૂત્રો અથવા મુખ્ય મુદ્દાઓની સુવાચ્ય નોંધ.`,
        subTasks: [
          "TLM દ્વારા મૂળભૂત સંકલ્પના મૂર્ત સ્વરૂપે દર્શાવવી",
          "પાઠ્યપુસ્તકના ઉદાહરણોની ક્રમબદ્ધ સમજૂતી આપવી",
          "વિદ્યાર્થીઓની શંકાઓનું તાત્કાલિક નિવારણ કરવું",
        ],
      },
      {
        phase: "૩. મહાવરો & સહયોગી જૂથકાર્ય (Elaboration & Group Activity)",
        durationMin: 12,
        teacherActivity: `શિક્ષક વર્ગને નાના જૂથોમાં વિભાજિત કરી કાર્યપત્રક (Worksheet) અથવા સ્વાધ્યાય કાર્ય સોંપશે અને માર્ગદર્શન આપશે.`,
        studentActivity: `વિદ્યાર્થીઓ જૂથમાં ચર્ચા કરીને ઉકેલ શોધશે અને પરિણામ રજૂ કરશે.`,
        blackboardWork: `જૂથકાર્યના પરિણામો અને સાચા જવાબોની નોંધ.`,
        subTasks: [
          "વર્ગખંડને નાના જૂથોમાં વહેંચી પ્રવૃત્તિ કરાવવી",
          "પીઅર લર્નિંગ (સહપાઠી અધ્યયન) પ્રોત્સાહિત કરવું",
          "શિક્ષક દ્વારા પ્રત્યેક જૂથનું વ્યક્તિગત નિરીક્ષણ",
        ],
      },
      {
        phase: "૪. રચનાત્મક મૂલ્યાંકન & સારાંશ (Evaluation & Recap)",
        durationMin: 5,
        teacherActivity: `શિક્ષક ઝડપી મૌખિક પ્રશ્નોત્તરી (Flash Quiz) દ્વારા શીખેલા મુદ્દાઓનું મૂલ્યાંકન કરશે.`,
        studentActivity: `વિદ્યાર્થીઓ પ્રશ્નોના જવાબો આપશે અને આજના તાસનો સારાંશ આપશે.`,
        blackboardWork: `આજના મુખ્ય તારણો અને ગૃહકાર્યની નોંધ.`,
        subTasks: [
          "તાસના મુખ્ય મુદ્દાઓનું ઝડપી પુનરાવર્તન",
          "રચનાત્મક મૂલ્યાંકન (Formative Quiz) લેવું",
          "ગૃહકાર્ય સોંપવું અને ડાયરીમાં નોંધ કરાવવી",
        ],
      },
      {
        phase: "૫. ઉપચારાત્મક કાર્ય & ગૃહકાર્ય (Remedial & Homework)",
        durationMin: 3,
        teacherActivity: `નબળા જણાતા બાળકો માટે સરળ ઉદાહરણો અને વિશેષ ગૃહકાર્ય સોંપશે.`,
        studentActivity: `ગૃહકાર્ય નોંધશે અને શંકા હોય તો પૂછી લેશે.`,
        blackboardWork: `ગૃહકાર્યના પ્રશ્નો અને સ્વાધ્યાય પેજ નંબર.`,
        subTasks: [
          "FLN / નબળા વિદ્યાર્થીઓ માટે વિશેષ નોંધ",
          "આવતા તાસની પૂર્વતૈયારી માટે સૂચના આપવી",
        ],
      },
    ],
    formativeAssessment: [
      {
        question: `૧. આજના તાસમાં શીખેલ ${topic} નો મુખ્ય નિયમ / વ્યાખ્યા તમારા શબ્દોમાં કહો.`,
        type: "oral",
        expectedAnswer: `વિદ્યાર્થી પોતાની ભાષામાં સરળતાથી સંકલ્પના સમજાવે.`,
      },
      {
        question: `૨. સ્વાધ્યાયમાંથી એક વ્યવહારિક ઉદાહરણ પોતાની નોટબુકમાં ગણી/લખી બતાવો.`,
        type: "activity",
        expectedAnswer: `સાચો તાર્કિક ઉકેલ અને ચોક્કસ પદ્ધતિ.`,
      },
      {
        question: `૩. આ સંકલ્પનાનો ઉપયોગ આપણા રોજિંદા જીવનમાં ક્યાં જોવા મળે છે?`,
        type: "short_answer",
        expectedAnswer: `દૈનિક જીવનના સાચા ઉદાહરણો જેમ કે વ્યવહાર, તાપમાન, અંતર વગેરે.`,
      },
    ],
    flnAndRemedialGuidance: {
      flnLevel: "મૂળભૂત ભાષા વાંચન-લેખન અને ગણન ક્ષમતા આધારિત સરળ પ્રશ્નોત્તરી.",
      remedialStrategy: "ધીમી ગતિએ શીખતા બાળકો માટે મૂર્ત સાધનો અને ફ્લેશકાર્ડ્સ દ્વારા પુનરાવર્તન કરાવવું.",
      extensionForAdvanced: "પ્રતિભાશાળી બાળકો માટે પડકારજનક કોયડા અને પ્રોજેક્ટ વર્ક સોંપવું.",
    },
    homeworkAndAssignment: `પાઠ્યપુસ્તકના સ્વાધ્યાયમાંથી પ્રશ્ન ૧ થી ૫ નોટબુકમાં લખવા અને ઘરની આસપાસ જોવા મળતા ઉદાહરણોની યાદી બનાવવી.`,
    teacherReflectiveNotes: `આજના તાસમાં ૮૫% વિદ્યાર્થીઓએ ઉત્સાહપૂર્વક ભાગ લીધો. બાકીના ૧૫% વિદ્યાર્થીઓ માટે આવતીકાલે પ્રસ્તાવનામાં વિશેષ પુનરાવર્તન કરાવીશ.`,
    dailyActivities: planType === "single_period" ? undefined : [
      {
        dayNumber: 1,
        title: "દિવસ ૧: પૂર્વજ્ઞાન ચકાસણી & સંકલ્પના પરિચય",
        topic: `${topic} - મૂળભૂત ઓળખ`,
        learningOutcome: `${loPrefix}${gradeNum}01`,
        teachingActivity: `વાર્તા અને ચાર્ટ દ્વારા પાઠની શરૂઆત.`,
        tlmUsed: `ચાર્ટ પેપર, શ્યામપાટ`,
        assessmentMethod: `મૌખિક પ્રશ્નોત્તરી`,
        homework: `પાઠ્યપુસ્તક વાંચન`,
        subTasks: ["પૂર્વજ્ઞાન ચકાસવું", "મુખ્ય સંકલ્પના સમજાવવી", "નોંધપોથી કાર્ય"],
      },
      {
        dayNumber: 2,
        title: "દિવસ ૨: ઉદાહરણો અને પ્રત્યક્ષ પ્રવૃત્તિ",
        topic: `${topic} - ઉદાહરણોનો મહાવરો`,
        learningOutcome: `${loPrefix}${gradeNum}02`,
        teachingActivity: `મૂર્ત વસ્તુઓ દ્વારા સ્ટેપ-બાય-સ્ટેપ ગણતરી/ચર્ચા.`,
        tlmUsed: `ફ્લેશકાર્ડ, વર્કશીટ`,
        assessmentMethod: `વર્ગખંડ અવલોકન`,
        homework: `સ્વાધ્યાય પ્રશ્નો ૧-૨`,
        subTasks: ["ઉદાહરણ ઉકેલવા", "વિદ્યાર્થીઓ પાસે બોર્ડ વર્ક કરાવવું"],
      },
      {
        dayNumber: 3,
        title: "દિવસ ૩: જૂથ પ્રવૃત્તિ અને પીઅર લર્નિંગ",
        topic: `${topic} - જૂથ સહયોગી કાર્ય`,
        learningOutcome: `${loPrefix}${gradeNum}02`,
        teachingActivity: `વર્ગને ૪ જૂથોમાં વહેંચી કોયડા ઉકેલ સોંપવો.`,
        tlmUsed: `જૂથ કાર્ડ, રંગીન સ્કેચપેન`,
        assessmentMethod: `જૂથ રજૂઆત`,
        homework: `પ્રોજેક્ટ ચાર્ટ તૈયાર કરવો`,
        subTasks: ["જૂથ વિભાજન", "માર્ગદર્શન", "રજૂઆત અને મૂલ્યાંકન"],
      },
      {
        dayNumber: 4,
        title: "દિવસ ૪: સ્વાધ્યાય લેખન અને FLN ઉપચારાત્મક કાર્ય",
        topic: `${topic} - વિસ્તૃત સ્વાધ્યાય`,
        learningOutcome: `${loPrefix}${gradeNum}03`,
        teachingActivity: `વ્યક્તિગત માર્ગદર્શન અને નબળા મુદ્દાઓનું નિવારણ.`,
        tlmUsed: `DIKSHA QR Code વિડીયો`,
        assessmentMethod: `લેખિત ચકાસણી`,
        homework: `બાકી રહેલ સ્વાધ્યાય પૂર્ણ કરવું`,
        subTasks: ["વ્યક્તિગત તપાસ", "ઉપચારાત્મક માર્ગદર્શન"],
      },
      {
        dayNumber: 5,
        title: "દિવસ ૫: એકમ કસોટી અને સર્વાંગી સમીક્ષા",
        topic: `${topic} - પરિણામ મૂલ્યાંકન`,
        learningOutcome: `${loPrefix}${gradeNum}01, 02, 03`,
        teachingActivity: `૧૦ ગુણની ઝડપી કસોટી અને ફીડબેક સત્ર.`,
        tlmUsed: `પ્રશ્નપત્રક સ્લિપ્સ`,
        assessmentMethod: `એકમ કસોટી ગુણાંકન`,
        homework: `ગૃહ અધ્યયન અને પુનરાવર્તન`,
        subTasks: ["કસોટી સંચાલન", "પરસ્પર તપાસ", "પ્રોત્સાહન આપવું"],
      },
    ],
  };
}

// Vite middleware / static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express v5 uses *all
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ShalaSarathi Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
