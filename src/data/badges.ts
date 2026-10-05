import { Badge } from '../types/dq';

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge-guardian',
    name: 'Digital Guardian',
    description: 'มีความรอบรู้ด้าน Cybersecurity ยอดเยี่ยม ป้องกันภัยไซเบอร์ได้อย่างมั่นใจ',
    iconName: 'ShieldCheck',
    unlocked: false,
    criteria: 'ทำคะแนนด้าน Cybersecurity ใน DQ Check ได้ 80% ขึ้นไป หรือตอบสถานการณ์ความปลอดภัยถูกต้องครบถ้วน',
    skillRelated: 'cybersecurity'
  },
  {
    id: 'badge-privacy',
    name: 'Privacy Protector',
    description: 'ผู้พิทักษ์ข้อมูลส่วนบุคคล เคารพความเป็นส่วนตัวของตนเองและผู้อื่น',
    iconName: 'Lock',
    unlocked: false,
    criteria: 'ทำคะแนนด้าน Privacy Management ได้ 80% ขึ้นไป',
    skillRelated: 'privacy'
  },
  {
    id: 'badge-fact-checker',
    name: 'Fact Checker',
    description: 'นักสืบดิจิทัล มีวิจารณญาณเฉียบคม แยกแยะความจริงและข่าวปลอมได้แม่นยำ',
    iconName: 'SearchCheck',
    unlocked: false,
    criteria: 'ทำคะแนนด้าน Critical Thinking ได้ 80% ขึ้นไป',
    skillRelated: 'critical_thinking'
  },
  {
    id: 'badge-digital-friend',
    name: 'Digital Friend',
    description: 'มีน้ำใจและความเห็นอกเห็นใจ (Digital Empathy) สร้างพลังบวกบนโลกออนไลน์',
    iconName: 'HeartHandshake',
    unlocked: false,
    criteria: 'ทำคะแนนด้าน Digital Empathy ได้ 80% ขึ้นไป',
    skillRelated: 'empathy'
  },
  {
    id: 'badge-screen-master',
    name: 'Screen Master',
    description: 'ผู้เชี่ยวชาญการจัดสรรเวลาหน้าจอ สร้างสมดุลชีวิตออนไลน์และชีวิตจริงอย่างลงตัว',
    iconName: 'Hourglass',
    unlocked: false,
    criteria: 'ทำคะแนนด้าน Screen Time Management ได้ 80% ขึ้นไป',
    skillRelated: 'screen_time'
  },
  {
    id: 'badge-simulation-ace',
    name: 'Simulation Ace',
    description: 'เซียนสถานการณ์จำลอง ตัดสินใจรับมือสถานการณ์ออนไลน์ได้ถูกต้องอย่างน้อย 8 สถานการณ์',
    iconName: 'Sparkles',
    unlocked: false,
    criteria: 'ตอบสถานการณ์จำลองถูกต้องตั้งแต่ 8 สถานการณ์ขึ้นไป'
  },
  {
    id: 'badge-citizen-all',
    name: 'Digital Citizen',
    description: 'ผู้เรียนรู้ครบถ้วนทั้ง 8 ทักษะความฉลาดทางดิจิทัลตามกรอบ สสวท.',
    iconName: 'Award',
    unlocked: false,
    criteria: 'ศึกษาเนื้อหาและทำเครื่องหมายผ่านบทเรียนครบทั้ง 8 ทักษะ'
  },
  {
    id: 'badge-scholar',
    name: 'DQ Scholar',
    description: 'นักวิชาการดิจิทัล ทำแบบทดสอบ Mini Quiz ผ่านคะแนนเต็มในทุกทักษะ',
    iconName: 'GraduationCap',
    unlocked: false,
    criteria: 'ทำแบบทดสอบ Mini Quiz ผ่านอย่างน้อย 6 บทเรียน'
  }
];

export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  nextLevelName: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Digital Beginner', minXp: 0, maxXp: 200, nextLevelName: 'Digital Explorer' },
  { level: 2, name: 'Digital Explorer', minXp: 201, maxXp: 500, nextLevelName: 'Digital Smart User' },
  { level: 3, name: 'Digital Smart User', minXp: 501, maxXp: 900, nextLevelName: 'Digital Guardian' },
  { level: 4, name: 'Digital Guardian', minXp: 901, maxXp: 1400, nextLevelName: 'Digital Citizen Master' },
  { level: 5, name: 'Digital Citizen Master', minXp: 1401, maxXp: 9999, nextLevelName: 'Max Level' },
];

export function getLevelFromXp(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}
