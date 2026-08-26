export type Designation = 
  | 'Primary Teacher (પ્રાથમિક શિક્ષક)' 
  | 'Head Teacher / Acharya (મુખ્ય શિક્ષક / આચાર્ય)' 
  | 'Assistant Teacher (સહાયક શિક્ષક)' 
  | 'CRCC (સી.આર.સી.કો.)' 
  | 'BRCC (બી.આર.સી.કો.)';

export type DistrictGujarat = 
  | 'Ahmedabad (અમદાવાદ)' 
  | 'Amreli (અમરેલી)' 
  | 'Anand (આણંદ)' 
  | 'Aravalli (અરવલ્લી)' 
  | 'Banaskantha (બનાસકાંઠા)' 
  | 'Bharuch (ભરૂચ)' 
  | 'Bhavnagar (ભાવનગર)' 
  | 'Botad (બોટાદ)' 
  | 'Chhota Udaipur (છોટા ઉદેપુર)' 
  | 'Dahod (દાહોદ)' 
  | 'Dang (ડાંગ)' 
  | 'Devbhumi Dwarka (દેવભૂમિ દ્વારકા)' 
  | 'Gandhinagar (ગાંધીનગર)' 
  | 'Gir Somnath (ગીર સોમનાથ)' 
  | 'Jamnagar (જામનગર)' 
  | 'Junagadh (જૂનાગઢ)' 
  | 'Kheda (ખેડા)' 
  | 'Kutch (કચ્છ)' 
  | 'Mahisagar (મહીસાગર)' 
  | 'Mehsana (મહેસાણા)' 
  | 'Morbi (મોરબી)' 
  | 'Narmada (નર્મદા)' 
  | 'Navsari (નવસારી)' 
  | 'Panchmahal (પંચમહાલ)' 
  | 'Patan (પાટણ)' 
  | 'Porbandar (પોરબંદર)' 
  | 'Rajkot (રાજકોટ)' 
  | 'Sabarkantha (સાબરકાંઠા)' 
  | 'Surat (સુરત)' 
  | 'Surendranagar (સુરેન્દ્રનગર)' 
  | 'Tapi (તાપી)' 
  | 'Vadodara (વડોદરા)' 
  | 'Valsad (વલસાડ)';

export interface SchoolProfile {
  id: string;
  schoolNameGuj: string;
  schoolNameEng: string;
  udiseCode: string;
  village: string;
  taluka: string;
  district: DistrictGujarat;
  address: string;
  payCenterSchool?: string;
  clusterName?: string;
}

export interface TeacherProfile {
  id: string;
  nameGuj: string;
  nameEng: string;
  mobile: string;
  email: string;
  designation: Designation;
  photoUrl?: string;
  academicYear: string;
  school: SchoolProfile;
  updatedAt: string;
}
