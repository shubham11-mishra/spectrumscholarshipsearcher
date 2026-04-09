export type Scholarship = {
  id: number;
  school: string;
  suburb: string;
  state: string;
  sector: string;
  gender: string;
  logo: string;
  name: string;
  category: string;
  value: string;
  valueNum: number;
  yearLevel: string;
  closing: string;
  closingLabel: string;
  testProvider: string;
  verified: boolean;
  updated: string;
  accentClass: "" | "coral" | "gold";
  url: string;
  desc: string;
  elig: string;
};

export const CATEGORIES = [
  { label: "All", icon: "✦" },
  { label: "Academic", icon: "📚" },
  { label: "Arts", icon: "🎨" },
  { label: "Sports", icon: "⚡" },
  { label: "STEM", icon: "🔬" },
  { label: "Music", icon: "🎵" },
  { label: "Financial Need", icon: "🏦" },
  { label: "Cultural", icon: "🌏" },
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 1, school: "Scotch College", suburb: "Hawthorn", state: "VIC", sector: "Independent", gender: "Boys", logo: "🏫",
    name: "Founders' Scholarship", category: "Academic", value: "$48,000/yr", valueNum: 48000, yearLevel: "Year 7",
    closing: "2026-04-15", closingLabel: "15 Apr", testProvider: "ACER", verified: true, updated: "2 hours ago", accentClass: "", url: "#",
    desc: "The Founders' Scholarship is Scotch College's most prestigious academic award, recognising exceptional intellectual ability and leadership potential. Awarded annually to up to three students entering Year 7.",
    elig: "Open to boys entering Year 7. Applicants must sit the ACER Scholarship Test. Financial need is not a requirement. Academic transcript and two referee reports required.",
  },
  {
    id: 2, school: "Melbourne Girls Grammar", suburb: "South Yarra", state: "VIC", sector: "Independent", gender: "Girls", logo: "🌸",
    name: "Excellence in Music Scholarship", category: "Music", value: "30% Fee Reduction", valueNum: 15000, yearLevel: "Year 7",
    closing: "2026-04-05", closingLabel: "5 Apr", testProvider: "Audition", verified: true, updated: "5 hours ago", accentClass: "coral", url: "#",
    desc: "Awarded to talented young musicians who demonstrate outstanding ability in any instrument or voice. Recipients join the school's renowned Conservatorium program.",
    elig: "Open to girls entering Years 7–10. Applicants must provide a 10-minute live audition. Grade 5 AMEB or equivalent required as minimum standard.",
  },
  {
    id: 3, school: "Geelong Grammar School", suburb: "Corio", state: "VIC", sector: "Independent", gender: "Co-ed", logo: "🏰",
    name: "Timbertop Outreach Scholarship", category: "Academic", value: "Full Fee Remission", valueNum: 60000, yearLevel: "Year 9",
    closing: "2026-05-30", closingLabel: "30 May", testProvider: "ACER", verified: true, updated: "1 day ago", accentClass: "gold", url: "#",
    desc: "One of Australia's most unique scholarship programs, offering full fee remission for the Year 9 Timbertop experience, a world-renowned outdoor education year.",
    elig: "Open to students of any gender entering Year 9. Financial need component. Must demonstrate leadership and service. Essay and interview required.",
  },
  {
    id: 4, school: "MLC School", suburb: "Burwood", state: "NSW", sector: "Independent", gender: "Girls", logo: "⭐",
    name: "Sports Excellence Award", category: "Sports", value: "25% Fee Reduction", valueNum: 10000, yearLevel: "Year 7",
    closing: "2026-04-20", closingLabel: "20 Apr", testProvider: "Trial & Assessment", verified: true, updated: "2 days ago", accentClass: "coral", url: "#",
    desc: "Recognises young sportswomen demonstrating exceptional talent and commitment in any sport sanctioned by the school's sporting program.",
    elig: "Girls entering Year 7 or Year 10. Must provide evidence of representative-level sport. Physical trials and interview required. Academic minimum NAPLAN Band 7.",
  },
  {
    id: 5, school: "Hale School", suburb: "Wembley Downs", state: "WA", sector: "Independent", gender: "Boys", logo: "🎯",
    name: "STEM Innovator Scholarship", category: "STEM", value: "$18,000/yr", valueNum: 18000, yearLevel: "Year 7",
    closing: "2026-06-15", closingLabel: "15 Jun", testProvider: "EduTest", verified: true, updated: "3 days ago", accentClass: "", url: "#",
    desc: "Designed to attract and support the next generation of science, technology, engineering and mathematics innovators. Award includes mentoring from industry partners.",
    elig: "Boys entering Year 7. Must complete EduTest assessment. Optional STEM project submission strengthens application. Three academic referees required.",
  },
  {
    id: 6, school: "Presbyterian Ladies' College", suburb: "Burwood", state: "VIC", sector: "Independent", gender: "Girls", logo: "📖",
    name: "Creative Arts Scholarship", category: "Arts", value: "20% Fee Reduction", valueNum: 9000, yearLevel: "Year 7",
    closing: "2026-04-08", closingLabel: "8 Apr", testProvider: "Portfolio Review", verified: true, updated: "4 days ago", accentClass: "coral", url: "#",
    desc: "Awarded to students with exceptional talent in visual arts, drama, dance, or creative writing. Recipients join PLC's flagship Creative Industries stream.",
    elig: "Girls entering Years 7, 9 or 10. Portfolio of 5–10 works or performance piece required. Interview with faculty panel. Academic assessment also required.",
  },
  {
    id: 7, school: "Cranbrook School", suburb: "Bellevue Hill", state: "NSW", sector: "Independent", gender: "Boys", logo: "🦁",
    name: "Dux Scholarship", category: "Academic", value: "50% Fee Reduction", valueNum: 25000, yearLevel: "Year 5",
    closing: "2026-07-31", closingLabel: "31 Jul", testProvider: "ACER", verified: true, updated: "1 week ago", accentClass: "gold", url: "#",
    desc: "The Dux Scholarship rewards exceptional academic potential in primary students entering Year 5, granting early entry into Cranbrook's junior school program.",
    elig: "Boys entering Year 5. Must sit the ACER Scholarship Test at the appropriate level. Interview with the Headmaster for shortlisted candidates.",
  },
  {
    id: 8, school: "Brisbane Grammar School", suburb: "Spring Hill", state: "QLD", sector: "Independent", gender: "Boys", logo: "📐",
    name: "Mathematics & Science Award", category: "STEM", value: "Full Fee Remission", valueNum: 55000, yearLevel: "Year 10",
    closing: "2026-08-15", closingLabel: "15 Aug", testProvider: "Sit-down exam", verified: false, updated: "2 weeks ago", accentClass: "", url: "#",
    desc: "One of Queensland's most competitive scholarships for academically gifted students in mathematics and the sciences, covering full tuition for senior school.",
    elig: "Boys entering Year 10. Competitive written examination in Mathematics and Science. Minimum 90th percentile on school's selection assessment.",
  },
  {
    id: 9, school: "Santa Maria College", suburb: "Attadale", state: "WA", sector: "Catholic", gender: "Girls", logo: "✝️",
    name: "Social Justice Scholarship", category: "Financial Need", value: "Up to $30,000/yr", valueNum: 30000, yearLevel: "Year 7",
    closing: "2026-05-01", closingLabel: "1 May", testProvider: "None", verified: true, updated: "5 days ago", accentClass: "", url: "#",
    desc: "Awarded to students from families experiencing financial hardship who demonstrate strong values, community service and leadership. Aligned with Catholic social teaching.",
    elig: "Girls entering Year 7. Family income assessment required. Community service record and essay on social justice topic. Confidential financial statement.",
  },
  {
    id: 10, school: "Sydney Grammar School", suburb: "Darlinghurst", state: "NSW", sector: "Independent", gender: "Boys", logo: "🏛️",
    name: "Classics & Humanities Scholarship", category: "Academic", value: "$40,000/yr", valueNum: 40000, yearLevel: "Year 7",
    closing: "2026-06-30", closingLabel: "30 Jun", testProvider: "Own assessment", verified: true, updated: "3 days ago", accentClass: "gold", url: "#",
    desc: "For students with a particular aptitude for language, history, philosophy and the humanities. Includes enrichment program with university academics.",
    elig: "Boys entering Year 7. Written examination focusing on comprehension, reasoning and essay writing. Shortlisted students interviewed by the Academic Committee.",
  },
  {
    id: 11, school: "Loreto Mandeville Hall", suburb: "Toorak", state: "VIC", sector: "Catholic", gender: "Girls", logo: "🌺",
    name: "Performing Arts Scholarship", category: "Arts", value: "15% Fee Reduction", valueNum: 6000, yearLevel: "Year 7",
    closing: "2026-04-12", closingLabel: "12 Apr", testProvider: "Audition", verified: true, updated: "1 day ago", accentClass: "coral", url: "#",
    desc: "Recognising excellence in dance, drama or music performance. Loreto's award celebrates artistic dedication and contribution to the school community.",
    elig: "Girls entering Year 7 or 9. Live audition or performance. Referee from current music/drama teacher. Academic minimum required alongside artistic achievement.",
  },
  {
    id: 12, school: "Emmanuel College", suburb: "Warrnambool", state: "VIC", sector: "Catholic", gender: "Co-ed", logo: "☀️",
    name: "Regional Excellence Bursary", category: "Financial Need", value: "Up to $20,000/yr", valueNum: 20000, yearLevel: "Year 7",
    closing: "2026-09-01", closingLabel: "1 Sep", testProvider: "None", verified: true, updated: "6 days ago", accentClass: "", url: "#",
    desc: "Supporting students from regional and rural Victoria who demonstrate academic potential but whose families face financial barriers to private school education.",
    elig: "Students entering Year 7 residing in regional Victoria. Means-tested. Academic record and principal's reference required. No entrance exam.",
  },
];

export function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export function getCatBadgeVariant(cat: string): "teal" | "coral" | "gold" | "gray" {
  const map: Record<string, "teal" | "coral" | "gold" | "gray"> = {
    Academic: "teal", Arts: "coral", Music: "coral", Sports: "teal",
    STEM: "gold", "Financial Need": "gray", Cultural: "gray",
  };
  return map[cat] || "gray";
}
