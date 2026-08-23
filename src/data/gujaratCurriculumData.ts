export interface CurriculumSubject {
  id: string;
  name: string; // e.g. "ગણિત (Mathematics)"
  gujaratiName: string;
  icon: string;
  standards: string[]; // ["ધોરણ ૧", "ધોરણ ૨", ...]
  chaptersByStandard: {
    [standard: string]: {
      chapterNo: number;
      name: string;
      topics: string[];
      defaultLO: string;
    }[];
  };
}

export const GUJARAT_CURRICULUM_STANDARDS = [
  "બાલવાટિકા (Pre-Primary / Balvatika)",
  "ધોરણ ૧ (Grade 1)",
  "ધોરણ ૨ (Grade 2)",
  "ધોરણ ૩ (Grade 3)",
  "ધોરણ ૪ (Grade 4)",
  "ધોરણ ૫ (Grade 5)",
  "ધોરણ ૬ (Grade 6)",
  "ધોરણ ૭ (Grade 7)",
  "ધોરણ ૮ (Grade 8)",
];

export const GUJARAT_CURRICULUM_SUBJECTS: { [key: string]: string[] } = {
  "બાલવાટિકા (Pre-Primary / Balvatika)": ["પ્રવૃત્તિ આધારિત ભાષા & ગણન (FLN Foundation)", "પર્યાવરણ પરિચય & બાળગીતો"],
  "ધોરણ ૧ (Grade 1)": ["કલરવ (ગુજરાતી)", "ગણિત ગમ્મત", "પ્રજ્ઞા પ્રવૃત્તિઓ (FLN)", "અંગ્રેજી (Let's Learn English)"],
  "ધોરણ ૨ (Grade 2)": ["કલરવ (ગુજરાતી)", "ગણિત ગમ્મત", "પ્રજ્ઞા પ્રવૃત્તિઓ (FLN)", "અંગ્રેજી (Let's Learn English)"],
  "ધોરણ ૩ (Grade 3)": ["કલશોર (ગુજરાતી)", "ગણિત ગમ્મત", "આસપાસ (પર્યાવરણ)", "અંગ્રેજી (Marigold)"],
  "ધોરણ ૪ (Grade 4)": ["કુહૂ (ગુજરાતી)", "ગણિત ગમ્મત", "આસપાસ (પર્યાવરણ)", "અંગ્રેજી (Marigold)", "હિન્દી"],
  "ધોરણ ૫ (Grade 5)": ["કેકારવ (ગુજરાતી)", "ગણિત ગમ્મત", "આસપાસ (પર્યાવરણ)", "અંગ્રેજી (Marigold)", "હિન્દી"],
  "ધોરણ ૬ (Grade 6)": ["ગણિત (Mathematics)", "વિજ્ઞાન (Science)", "સામાજિક વિજ્ઞાન (Social Science)", "ગુજરાતી (પલાશ)", "અંગ્રેજી (Honeysuckle)", "હિન્દી", "સંસ્કૃત"],
  "ધોરણ ૭ (Grade 7)": ["ગણિત (Mathematics)", "વિજ્ઞાન (Science)", "સામાજિક વિજ્ઞાન (Social Science)", "ગુજરાતી", "અંગ્રેજી (Honeycomb)", "હિન્દી", "સંસ્કૃત"],
  "ધોરણ ૮ (Grade 8)": ["ગણિત (Mathematics)", "વિજ્ઞાન (Science)", "સામાજિક વિજ્ઞાન (Social Science)", "ગુજરાતી", "અંગ્રેજી (Honeydew)", "હિન્દી", "સંસ્કૃત"],
};

export const POPULAR_CURRICULUM_PRESETS = [
  {
    standard: "ધોરણ ૭ (Grade 7)",
    subject: "ગણિત (Mathematics)",
    chapter: "પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ (Integers)",
    topic: "સંખ્યારેખા નિરૂપણ અને સરવાળા-બાદબાકીના નિયમો",
    pedagogicalFocus: "activity_based",
    planType: "single_period" as const,
    durationMinutes: 45,
    tag: "GCERT ગણિત",
  },
  {
    standard: "ધોરણ ૬ (Grade 6)",
    subject: "વિજ્ઞાન (Science)",
    chapter: "પ્રકરણ ૪: વનસ્પતિની ઓળખ (Getting to Know Plants)",
    topic: "મૂળ, પ્રકાંડ, પર્ણ અને પુષ્પના ભાગો અને કાર્યો",
    pedagogicalFocus: "lab_experiment",
    planType: "weekly_block" as const,
    durationMinutes: 45,
    tag: "પ્રાયોગિક વિજ્ઞાન",
  },
  {
    standard: "ધોરણ ૫ (Grade 5)",
    subject: "આસપાસ (પર્યાવરણ)",
    chapter: "પ્રકરણ ૬: જળ એ જ જીવન (Water O' Water)",
    topic: "પાણીના સ્ત્રોત, જળ ચક્ર અને જળ સંરક્ષણ પદ્ધતિઓ",
    pedagogicalFocus: "learning_outcomes",
    planType: "single_period" as const,
    durationMinutes: 45,
    tag: "FLN & આસપાસ",
  },
  {
    standard: "ધોરણ ૮ (Grade 8)",
    subject: "સામાજિક વિજ્ઞાન (Social Science)",
    chapter: "પ્રકરણ ૧: ભારતમાં યુરોપિયનોનું આગમન",
    topic: "વાસ્કો-દ-ગામા, ડચ, અંગ્રેજો અને પ્લાસીનું યુદ્ધ",
    pedagogicalFocus: "learning_outcomes",
    planType: "weekly_block" as const,
    durationMinutes: 45,
    tag: "ઇતિહાસ",
  },
  {
    standard: "ધોરણ ૪ (Grade 4)",
    subject: "કુહૂ (ગુજરાતી)",
    chapter: "એકમ ૩: શંખલાની બહેન છીપલી",
    topic: "કાવ્યગાન, નવા શબ્દો અને સર્જનાત્મક લેખન",
    pedagogicalFocus: "fln_remedial",
    planType: "single_period" as const,
    durationMinutes: 45,
    tag: "ભાષા સજ્જતા",
  },
  {
    standard: "ધોરણ ૩ (Grade 3)",
    subject: "ગણિત ગમ્મત",
    chapter: "પ્રકરણ ૩: આપો અને લો (Addition & Subtraction)",
    topic: "દશકાવાળી બાદબાકી અને મૂર્ત સાધનોથી ગણતરી",
    pedagogicalFocus: "fln_remedial",
    planType: "monthly_breakdown" as const,
    durationMinutes: 45,
    tag: "મિશન સ્કૂલ્સ ઓફ એક્સલન્સ",
  },
];

export const SAMPLE_CHAPTER_SUGGESTIONS: { [subject: string]: string[] } = {
  "ગણિત": [
    "પૂર્ણાંક સંખ્યાઓ (Integers)",
    "અપૂર્ણાંક અને દશાંશ સંખ્યાઓ (Fractions & Decimals)",
    "રેખા અને ખૂણા (Lines & Angles)",
    "ત્રિકોણ અને તેના ગુણધર્મો (Triangles)",
    "સમીકરણ (Simple Equations)",
    "રાશિઓની તુલના (Comparing Quantities)",
    "પરિમિતિ અને ક્ષેત્રફળ (Perimeter & Area)",
    "બીજગણિતીય પદાવલિ (Algebraic Expressions)",
  ],
  "વિજ્ઞાન": [
    "ખોરાકના ઘટકો (Components of Food)",
    "વનસ્પતિની ઓળખ (Getting to Know Plants)",
    "ગતિ અને અંતરનું માપન (Motion & Measurement)",
    "પ્રકાશ, પડછાયો અને પરાવર્તન (Light, Shadows & Reflection)",
    "વિદ્યુત તથા પરિપથ (Electricity & Circuits)",
    "ચુંબક સાથે ગમ્મત (Fun with Magnets)",
    "આપણી આસપાસની હવા (Air Around Us)",
    "પ્રાણીઓમાં પોષણ (Nutrition in Animals)",
  ],
  "સામાજિક વિજ્ઞાન": [
    "ચાલો, ઇતિહાસ જાણીએ",
    "પૃથ્વીના આવરણો (Spheres of Earth)",
    "આપણું ઘર પૃથ્વી (Solar System & Earth)",
    "ગુજરાત: ભૂગોળ અને કુદરતી સંપત્તિ",
    "ભારતમાં સ્થાનિક સરકાર (Local Self Government)",
    "શાંતિની શોધમાં: બુદ્ધ અને મહાવીર",
    "ભારતનું બંધારણ (Indian Constitution)",
  ],
  "ગુજરાતી": [
    "રેલવે સ્ટેશન (ચિત્રપાઠ)",
    "હિંદમાતાને સંબોધન (કાવ્ય)",
    "દ્વિદલ (બોધવાર્તા)",
    "સુંદર સુંદર (પ્રકૃતિકાવ્ય)",
    "શરદીના પ્રતાપે (હાસ્યકથા)",
    "રાતા ફૂલ (કાવ્ય)",
    "પરોપકારી મનુષ્યો (નિબંધ)",
  ],
  "અંગ્રેજી": [
    "Unit 1: Where were you? (Past Tense & Rhymes)",
    "Unit 2: Two Moons (Story & Adjectives)",
    "Unit 3: What were you doing? (Action words & Grammar)",
    "Unit 4: Fast Fingers First (Vocabulary & Quiz)",
    "Phonics & Sight Words Practice",
  ],
  "પર્યાવરણ": [
    "પૂનમે શું જોયું? (પ્રાણીઓ અને પક્ષીઓ)",
    "વનપરી (વનસ્પતિની વિવિધતા)",
    "પાણી જ પાણી (જળ સંરક્ષણ)",
    "છોટુનું ઘર (આશ્રયસ્થાન અને સ્વચ્છતા)",
    "અનિતા અને મધમાખીઓ (મહેનત અને આજીવિકા)",
  ],
};
