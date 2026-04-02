export interface GrammarUnit {
  id: string;
  level: 1 | 2;
  unitNumber: number;
  title: string;
  titleCn: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const level1Units: GrammarUnit[] = [
  { id: 'l1-u01', level: 1, unitNumber: 1, title: "I'm / My name's", titleCn: '自我介绍', description: '学习用英语介绍自己', icon: '👋', color: '#FF6B6B', bgColor: '#FFF0F0' },
  { id: 'l1-u02', level: 1, unitNumber: 2, title: 'This is / That is', titleCn: '这是/那是', description: '学习指示代词', icon: '👆', color: '#FF8E53', bgColor: '#FFF3EC' },
  { id: 'l1-u03', level: 1, unitNumber: 3, title: "He's / She's / It's", titleCn: '他/她/它是', description: '学习第三人称代词', icon: '👫', color: '#FFB347', bgColor: '#FFF8EC' },
  { id: 'l1-u04', level: 1, unitNumber: 4, title: 'Plurals (-s)', titleCn: '复数', description: '学习名词复数形式', icon: '🐱', color: '#FFD43B', bgColor: '#FFFBEB' },
  { id: 'l1-u05', level: 1, unitNumber: 5, title: 'Have got / Has got', titleCn: '拥有', description: '学习表达"有"', icon: '🎒', color: '#A8E063', bgColor: '#F2FAEB' },
  { id: 'l1-u06', level: 1, unitNumber: 6, title: 'There is / There are', titleCn: '有...在那里', description: '学习"某处有某物"', icon: '🏠', color: '#51CF66', bgColor: '#EDFBF0' },
  { id: 'l1-u07', level: 1, unitNumber: 7, title: "Can / Can't", titleCn: '能/不能', description: '学习表达能力', icon: '💪', color: '#4ECDC4', bgColor: '#ECF9F8' },
  { id: 'l1-u08', level: 1, unitNumber: 8, title: 'Present Simple (I/you)', titleCn: '一般现在时(一)', description: '我/你/我们/他们做某事', icon: '🏃', color: '#45B7D1', bgColor: '#ECF6FA' },
  { id: 'l1-u09', level: 1, unitNumber: 9, title: 'Present Simple (he/she)', titleCn: '一般现在时(二)', description: '他/她/它做某事', icon: '📝', color: '#5F7FFF', bgColor: '#EEF1FF' },
  { id: 'l1-u10', level: 1, unitNumber: 10, title: 'Like + -ing', titleCn: '喜欢做...', description: '学习表达兴趣爱好', icon: '⭐', color: '#7C5CFC', bgColor: '#F1EEFF' },
  { id: 'l1-u11', level: 1, unitNumber: 11, title: "Possessive 's", titleCn: '所有格', description: "学习表达'谁的'", icon: '🏷️', color: '#C77DFF', bgColor: '#F5EEFF' },
  { id: 'l1-u12', level: 1, unitNumber: 12, title: 'Prepositions of place', titleCn: '方位介词', description: '学习 in, on, under', icon: '📦', color: '#FF7EB3', bgColor: '#FFF0F6' },
];

export const level2Units: GrammarUnit[] = [
  { id: 'l2-u01', level: 2, unitNumber: 1, title: 'Present Simple review', titleCn: '一般现在时复习', description: '复习一般现在时的用法', icon: '🔄', color: '#4ECDC4', bgColor: '#ECF9F8' },
  { id: 'l2-u02', level: 2, unitNumber: 2, title: 'Present Continuous', titleCn: '现在进行时', description: '学习正在发生的事情', icon: '🏊', color: '#45B7D1', bgColor: '#ECF6FA' },
  { id: 'l2-u03', level: 2, unitNumber: 3, title: 'Simple vs Continuous', titleCn: '现在时 vs 进行时', description: '区分两种时态', icon: '⚖️', color: '#5F7FFF', bgColor: '#EEF1FF' },
  { id: 'l2-u04', level: 2, unitNumber: 4, title: 'Past Simple: was/were', titleCn: '过去时: was/were', description: '学习过去的状态', icon: '⏰', color: '#7C5CFC', bgColor: '#F1EEFF' },
  { id: 'l2-u05', level: 2, unitNumber: 5, title: 'Past Simple: regular', titleCn: '过去时: 规则动词', description: '学习动词加-ed', icon: '📅', color: '#C77DFF', bgColor: '#F5EEFF' },
  { id: 'l2-u06', level: 2, unitNumber: 6, title: 'Past Simple: irregular', titleCn: '过去时: 不规则动词', description: '学习不规则变化', icon: '🎭', color: '#FF7EB3', bgColor: '#FFF0F6' },
  { id: 'l2-u07', level: 2, unitNumber: 7, title: 'Comparatives', titleCn: '比较级', description: '学习比较两个事物', icon: '📏', color: '#FF6B6B', bgColor: '#FFF0F0' },
  { id: 'l2-u08', level: 2, unitNumber: 8, title: 'Superlatives', titleCn: '最高级', description: '学习最...的表达', icon: '🏆', color: '#FF8E53', bgColor: '#FFF3EC' },
  { id: 'l2-u09', level: 2, unitNumber: 9, title: 'Going to (future)', titleCn: '将来时', description: '学习表达将要做的事', icon: '🚀', color: '#FFB347', bgColor: '#FFF8EC' },
  { id: 'l2-u10', level: 2, unitNumber: 10, title: 'Must / Mustn\'t', titleCn: '必须/禁止', description: '学习规则和禁令', icon: '🚦', color: '#FFD43B', bgColor: '#FFFBEB' },
  { id: 'l2-u11', level: 2, unitNumber: 11, title: 'Some / Any', titleCn: '一些', description: '学习 some 和 any 的用法', icon: '🍎', color: '#A8E063', bgColor: '#F2FAEB' },
  { id: 'l2-u12', level: 2, unitNumber: 12, title: 'How much / How many', titleCn: '多少', description: '学习询问数量', icon: '🔢', color: '#51CF66', bgColor: '#EDFBF0' },
];

export function getUnits(level: number): GrammarUnit[] {
  return level === 1 ? level1Units : level2Units;
}

export function getUnit(level: number, unitNumber: number): GrammarUnit | undefined {
  const units = getUnits(level);
  return units.find(u => u.unitNumber === unitNumber);
}
