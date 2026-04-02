# Grammar Friends Web App - 设计文档

## 1. 项目概述

**产品名称**: Grammar Friends 语法小伙伴
**目标用户**: 6-8 岁小学生（独立使用）
**教材范围**: Grammar Friends Level 1-2（Oxford University Press）
**技术栈**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
**部署方式**: 纯前端，无后端依赖，localStorage 持久化

---

## 2. 语法知识点梳理

### Level 1（适合1年级，约6-7岁）

| Unit | 语法点 | 示例 |
|------|--------|------|
| 1 | I'm / My name's | I'm Tom. My name's Lucy. |
| 2 | This is / That is | This is a cat. That is a dog. |
| 3 | He's / She's / It's | He's a boy. She's a girl. |
| 4 | Plurals (-s) | one cat → two cats |
| 5 | Have got / Has got | I have got a ball. She has got a doll. |
| 6 | There is / There are | There is a book. There are two pens. |
| 7 | Can / Can't | I can run. I can't fly. |
| 8 | Present Simple (I/you/we/they) | I like apples. They play football. |
| 9 | Present Simple (he/she/it + -s) | He likes milk. She plays piano. |
| 10 | Like + -ing | I like swimming. He likes reading. |
| 11 | Possessive 's | Tom's bag. Lucy's pencil. |
| 12 | Prepositions of place | in, on, under, next to |

### Level 2（适合2年级，约7-8岁）

| Unit | 语法点 | 示例 |
|------|--------|------|
| 1 | Present Simple review | Do you like...? Yes, I do. / No, I don't. |
| 2 | Present Continuous | I am running. She is reading. |
| 3 | Present Simple vs Continuous | I play (every day) vs I am playing (now). |
| 4 | Past Simple: was / were | I was happy. They were at school. |
| 5 | Past Simple: regular (-ed) | I walked. She played. |
| 6 | Past Simple: irregular | I went. She ate. He saw. |
| 7 | Comparatives (-er / more) | bigger, smaller, more beautiful |
| 8 | Superlatives (-est / most) | the biggest, the most beautiful |
| 9 | Going to (future) | I'm going to swim. |
| 10 | Must / Mustn't | You must be quiet. You mustn't run. |
| 11 | Some / Any | some apples, any milk? |
| 12 | How much / How many | How many books? How much water? |

---

## 3. 练习题型设计

针对小学生的认知特点，设计以下 **6 种核心题型**：

### 3.1 选择题 (Multiple Choice)
- **形式**: 给出句子，选择正确答案填空
- **适用**: 所有语法点的基础练习
- **交互**: 点击选项，即时反馈 ✓/✗
```
He ___ a teacher.
○ am   ● is   ○ are
```

### 3.2 填空题 (Fill in the Blank)
- **形式**: 在句子中输入正确的单词
- **适用**: 动词变形、介词、冠词等
- **交互**: 输入框 + 提交按钮，支持拼写容错
```
She ___(like) swimming.  → likes
```

### 3.3 拖拽排序 (Word Ordering)
- **形式**: 把打乱的单词拖拽排列成正确句子
- **适用**: 句子结构理解
- **交互**: 触摸/鼠标拖拽，可点击选中
```
[is] [a] [This] [cat] → This is a cat.
```

### 3.4 配对连线 (Matching)
- **形式**: 左右两列，连接匹配的项目
- **适用**: 单复数、时态变换、问答配对
- **交互**: 点击左边再点击右边进行配对
```
I          are
He    →    am
They       is
```

### 3.5 判断对错 (True or False)
- **形式**: 给出句子，判断语法是否正确
- **适用**: 常见错误辨析
- **交互**: 点击 ✓ 或 ✗ 按钮
```
"He can flies." → ✗ (He can fly.)
```

### 3.6 图片选择 (Picture Choice)
- **形式**: 看图选择/填写正确描述
- **适用**: 介词、名词、动词等具象语法点
- **交互**: 点击对应图片
```
[图: 猫在桌子上面]
The cat is ___ the table.
○ in   ○ under   ● on
```

---

## 4. 应用架构设计

### 4.1 页面结构 (Routes)

```
/                          → 首页（选择级别）
/level/[id]                → 级别主页（Unit 列表，显示进度）
/level/[id]/unit/[unitId]  → 单元学习页（语法讲解 + 练习入口）
/level/[id]/unit/[unitId]/learn    → 语法讲解（动画/图解）
/level/[id]/unit/[unitId]/practice → 练习题（多种题型混合）
/level/[id]/unit/[unitId]/quiz     → 单元测验（限时/计分）
/review                    → 错题本 / 复习
/achievements              → 成就 / 勋章墙
```

### 4.2 核心数据模型

```typescript
// 语法知识点
interface GrammarUnit {
  id: string;                    // "l1-u01"
  level: 1 | 2;
  unitNumber: number;
  title: string;                 // "I'm / My name's"
  description: string;           // 简短中文说明
  grammarPoints: GrammarPoint[]; // 语法要点
  exercises: Exercise[];         // 练习题集
}

// 语法讲解
interface GrammarPoint {
  id: string;
  rule: string;         // 规则说明（中英双语）
  examples: Example[];  // 例句
  tips: string[];       // 小贴士 / 易错点
  illustration?: string; // 插图/动画路径
}

interface Example {
  english: string;   // "I'm Tom."
  chinese: string;   // "我是汤姆。"
  highlight: string; // 高亮的语法结构
}

// 练习题
interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'word-order' |
        'matching' | 'true-false' | 'picture-choice';
  difficulty: 1 | 2 | 3;  // 简单/中等/挑战
  question: QuestionData;  // 题目数据（按类型不同）
  answer: AnswerData;      // 正确答案
  explanation: string;     // 答案解析（中文）
  hint?: string;           // 提示
}

// 学生进度（localStorage）
interface StudentProgress {
  currentLevel: number;
  completedUnits: string[];          // ["l1-u01", "l1-u02"]
  exerciseResults: ExerciseResult[]; // 做题记录
  wrongAnswers: WrongAnswer[];       // 错题本
  stars: number;                     // 总星星数
  achievements: string[];            // 已解锁成就
  streakDays: number;                // 连续学习天数
  lastStudyDate: string;             // 上次学习日期
}

interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  attempts: number;     // 尝试次数
  timestamp: string;
}
```

### 4.3 项目目录结构

```
gf/
├── public/
│   ├── images/
│   │   ├── characters/     # 卡通角色形象
│   │   ├── grammar/        # 语法图解
│   │   ├── exercises/      # 练习题配图
│   │   └── achievements/   # 成就勋章图标
│   └── sounds/
│       ├── correct.mp3     # 答对音效
│       ├── wrong.mp3       # 答错音效
│       ├── star.mp3        # 获得星星
│       └── achievement.mp3 # 解锁成就
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 全局布局
│   │   ├── page.tsx            # 首页
│   │   ├── level/
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # 级别主页
│   │   │       └── unit/
│   │   │           └── [unitId]/
│   │   │               ├── page.tsx       # 单元概览
│   │   │               ├── learn/page.tsx  # 语法讲解
│   │   │               ├── practice/page.tsx # 练习
│   │   │               └── quiz/page.tsx    # 测验
│   │   ├── review/
│   │   │   └── page.tsx        # 错题本
│   │   └── achievements/
│   │       └── page.tsx        # 成就墙
│   │
│   ├── components/
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── exercises/          # 题型组件
│   │   │   ├── MultipleChoice.tsx
│   │   │   ├── FillBlank.tsx
│   │   │   ├── WordOrder.tsx
│   │   │   ├── Matching.tsx
│   │   │   ├── TrueFalse.tsx
│   │   │   ├── PictureChoice.tsx
│   │   │   └── ExerciseRenderer.tsx  # 统一渲染器
│   │   │
│   │   ├── grammar/            # 语法讲解组件
│   │   │   ├── GrammarCard.tsx
│   │   │   ├── ExampleSentence.tsx
│   │   │   └── GrammarAnimation.tsx
│   │   │
│   │   └── layout/             # 布局组件
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── data/                   # 静态数据（题库）
│   │   ├── level1/
│   │   │   ├── unit01.ts
│   │   │   ├── unit02.ts
│   │   │   └── ...
│   │   ├── level2/
│   │   │   ├── unit01.ts
│   │   │   └── ...
│   │   └── achievements.ts
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useProgress.ts      # 进度管理
│   │   ├── useExercise.ts      # 做题逻辑
│   │   ├── useAudio.ts         # 音效播放
│   │   └── useAchievements.ts  # 成就系统
│   │
│   ├── lib/                    # 工具函数
│   │   ├── storage.ts          # localStorage 封装
│   │   ├── scoring.ts          # 计分逻辑
│   │   └── utils.ts
│   │
│   └── types/                  # TypeScript 类型定义
│       ├── grammar.ts
│       ├── exercise.ts
│       └── progress.ts
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── DESIGN.md
```

---

## 5. UI/UX 设计

### 5.1 设计原则

1. **大字体、大按钮**: 所有交互元素至少 44px 触摸区域，字体不小于 16px
2. **色彩丰富但不杂乱**: 每个 Level 一个主题色，每个 Unit 一个辅助色
3. **即时反馈**: 每个操作都有视觉+声音反馈
4. **正向激励**: 答错不批评，鼓励再试一次
5. **中英双语**: 语法讲解用中文，例句和练习用英文

### 5.2 色彩方案

```
Level 1 主题色: #FF6B6B (暖红) + #FFE66D (阳光黄)
Level 2 主题色: #4ECDC4 (薄荷绿) + #45B7D1 (天空蓝)

正确反馈:   #51CF66 (绿色) + ✓ 动画 + 音效
错误反馈:   #FF6B6B (红色) + 轻微抖动 + 音效（温和的）
星星/金币:  #FFD43B (金色)
背景:       #FFF9DB (暖白) — 护眼
```

### 5.3 卡通角色 (Mascots)

建议设计 2-3 个卡通角色贯穿全 App：
- **Grammar Giraffe** 🦒 — 主角，引导学习、给出讲解
- **Quiz Owl** 🦉 — 出现在测验环节，鼓励答题
- **Star Fox** 🦊 — 出现在成就系统，颁发奖励

（初期可用 emoji 或简单 SVG 代替，后期可请插画师绘制）

### 5.4 核心页面原型

#### 首页
```
┌─────────────────────────────────┐
│     🦒 Grammar Friends          │
│     语法小伙伴                   │
│                                  │
│   ┌──────────┐  ┌──────────┐    │
│   │  Level 1 │  │  Level 2 │    │
│   │  ⭐⭐⭐   │  │  ⭐⭐⭐   │    │
│   │  Book 1  │  │  Book 2  │    │
│   │ 进度 60% │  │ 进度 20% │    │
│   └──────────┘  └──────────┘    │
│                                  │
│   [📖 错题本]  [🏆 我的成就]     │
└─────────────────────────────────┘
```

#### Unit 列表页
```
┌─────────────────────────────────┐
│  ← Level 1                      │
│                                  │
│  Unit 1: I'm / My name's  ⭐⭐⭐ │
│  ████████████████░░░░ 80%       │
│                                  │
│  Unit 2: This is / That is ⭐⭐  │
│  ██████████░░░░░░░░░░ 50%       │
│                                  │
│  Unit 3: He's / She's  🔒       │
│  ░░░░░░░░░░░░░░░░░░░░ 0%       │
│  (完成 Unit 2 解锁)              │
│                                  │
│  ...                             │
└─────────────────────────────────┘
```

#### 单元学习页
```
┌─────────────────────────────────┐
│  ← Unit 1: I'm / My name's     │
│                                  │
│  🦒 "Let's learn about I'm!"   │
│                                  │
│  ┌─────────────────────────┐    │
│  │  📚 语法讲解              │    │
│  │  学习这个单元的语法规则    │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  ✏️ 练习                  │    │
│  │  做练习巩固语法 (12题)     │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  🏆 单元测验              │    │
│  │  测试你的掌握程度          │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### 做题页面
```
┌─────────────────────────────────┐
│  Unit 1 · 练习         3/12     │
│  ████████░░░░░░░░░░░░░░         │
│                                  │
│  🦉 Choose the correct answer:  │
│                                  │
│  He ___ a student.               │
│                                  │
│  ┌─────────┐  ┌─────────┐      │
│  │   am    │  │   is    │      │
│  └─────────┘  └─────────┘      │
│  ┌─────────┐  ┌─────────┐      │
│  │   are   │  │   be    │      │
│  └─────────┘  └─────────┘      │
│                                  │
│         [💡 提示]                │
└─────────────────────────────────┘
```

---

## 6. 游戏化系统

### 6.1 星星系统 (Stars)
- 每道练习题答对得 1 ⭐
- 一次答对额外 +1 ⭐（鼓励认真思考）
- 每个 Unit 最多 3 星评价（按正确率）：
  - ≥90% → ⭐⭐⭐
  - ≥70% → ⭐⭐
  - ≥50% → ⭐
  - <50% → 鼓励重做

### 6.2 成就系统 (Achievements)
| 成就 | 条件 | 图标 |
|------|------|------|
| First Step | 完成第一道练习 | 👣 |
| Perfect Unit | 某个 Unit 全对 | 💯 |
| Grammar Star | 累计获得 50 颗星 | 🌟 |
| Week Warrior | 连续学习 7 天 | 🔥 |
| Level Master | 完成一个 Level 全部 Unit | 👑 |
| Mistake Hunter | 错题本中的题全部答对 | 🎯 |
| Speed Runner | 测验中 2 分钟内完成 | ⚡ |
| Explorer | 学习了所有语法讲解 | 🗺️ |

### 6.3 连续学习 (Streak)
- 首页显示连续学习天数
- 每天完成至少 5 道题算"打卡"
- 连续天数越多，UI 上的火焰越大 🔥

### 6.4 错题复习 (Review)
- 答错的题自动加入错题本
- 错题本按 Unit 分组
- 每次打开 App 建议先复习 3-5 道错题
- 连续答对 3 次从错题本移除

---

## 7. 语法讲解设计

### 7.1 讲解原则
- **中文主导**: 规则用简单中文解释，例句用英文
- **类比学习**: 用中文类比帮助理解（如 "is" 就像中文的 "是"）
- **对比展示**: 正确 vs 错误用法对比
- **渐进式**: 先给规则 → 再看例句 → 最后练一练

### 7.2 讲解卡片格式示例

```
┌─────────────────────────────────┐
│  📖 语法规则                     │
│                                  │
│  用 "is" 来描述「一个」东西：      │
│  This is + 一个东西              │
│                                  │
│  ✅ This is a cat.    这是一只猫  │
│  ✅ This is my book.  这是我的书  │
│                                  │
│  ⚠️ 常见错误：                    │
│  ❌ This is a cats.              │
│  ✅ This is a cat.               │
│  (is 后面用单数！)                │
│                                  │
│  💡 小贴士：                      │
│  "this" 指近的，"that" 指远的     │
│  就像中文的 "这" 和 "那"          │
│                                  │
│            [✏️ 来练一练！]         │
└─────────────────────────────────┘
```

---

## 8. 技术实现要点

### 8.1 Next.js 配置
```javascript
// next.config.ts
const nextConfig = {
  output: 'export',  // 静态导出，可部署到任意静态托管
  images: {
    unoptimized: true  // 静态导出不支持图片优化
  }
};
```

### 8.2 关键技术选型

| 需求 | 方案 | 说明 |
|------|------|------|
| CSS 框架 | Tailwind CSS | 快速开发，响应式 |
| 动画 | Framer Motion | 拖拽、过渡动画 |
| 拖拽 | @dnd-kit/core | 轻量拖拽库，适合排序题 |
| 音效 | use-sound (howler.js) | 简单音效播放 |
| 状态管理 | Zustand | 轻量全局状态 |
| 存储 | localStorage | 进度持久化 |
| 图标 | Lucide React | 清晰的图标库 |
| 部署 | Vercel / GitHub Pages | 零成本静态部署 |

### 8.3 性能考虑
- 纯静态导出 (SSG)，首屏加载快
- 图片使用 WebP 格式 + 懒加载
- 题库数据按 Unit 拆分，按需加载
- 音效文件预加载（文件很小）

### 8.4 响应式设计
- 最小支持宽度: 320px（手机竖屏）
- 最佳体验: 768px+（平板横屏）
- 平板优先设计（很多小朋友用 iPad 学习）

### 8.5 无障碍
- 所有图片有 alt 文本
- 按钮有足够大的点击区域
- 颜色对比度符合 WCAG AA 标准
- 支持键盘导航

---

## 9. 数据结构示例

### 题库数据示例 (data/level1/unit01.ts)

```typescript
import { GrammarUnit } from '@/types/grammar';

export const unit01: GrammarUnit = {
  id: 'l1-u01',
  level: 1,
  unitNumber: 1,
  title: "I'm / My name's",
  description: '学习用 I\'m 和 My name\'s 介绍自己',
  grammarPoints: [
    {
      id: 'l1-u01-gp1',
      rule: '用 "I\'m" 来说"我是..."。I\'m 是 I am 的缩写。',
      examples: [
        {
          english: "I'm Tom.",
          chinese: '我是汤姆。',
          highlight: "I'm"
        },
        {
          english: "I'm a student.",
          chinese: '我是一个学生。',
          highlight: "I'm"
        }
      ],
      tips: [
        '说话的时候，我们常用 I\'m，不用 I am',
        '注意：I 永远大写！'
      ]
    },
    {
      id: 'l1-u01-gp2',
      rule: '用 "My name\'s" 来说"我的名字是..."。name\'s 是 name is 的缩写。',
      examples: [
        {
          english: "My name's Lucy.",
          chinese: '我的名字是露西。',
          highlight: "My name's"
        }
      ],
      tips: [
        'My name\'s 和 I\'m 意思差不多，都是介绍自己'
      ]
    }
  ],
  exercises: [
    {
      id: 'l1-u01-ex01',
      type: 'multiple-choice',
      difficulty: 1,
      question: {
        prompt: '选择正确的答案：',
        sentence: '___ Tom.',
        options: ["I'm", "You're", "He's", "My"],
      },
      answer: { correct: "I'm" },
      explanation: '介绍自己用 I\'m（我是），所以是 I\'m Tom.',
      hint: '介绍"我"自己用什么？'
    },
    {
      id: 'l1-u01-ex02',
      type: 'word-order',
      difficulty: 2,
      question: {
        instruction: '把单词排列成正确的句子：',
        words: ['name\'s', 'My', 'Lucy', '.'],
      },
      answer: { correct: ['My', 'name\'s', 'Lucy', '.'] },
      explanation: '正确顺序：My name\'s Lucy. (我的名字是露西。)',
    },
    {
      id: 'l1-u01-ex03',
      type: 'fill-blank',
      difficulty: 2,
      question: {
        sentence: 'My _____ Tom.',
        hint: "name's",
      },
      answer: { correct: "name's", acceptAlternatives: ["name is"] },
      explanation: 'My name\'s Tom = 我的名字是汤姆。',
    }
  ]
};
```

---

## 10. 开发路线图 (Roadmap)

### Phase 1: MVP（2-3 周）
- [x] 项目初始化 (Next.js + Tailwind + TypeScript)
- [ ] 基础 UI 组件（Button, Card, ProgressBar）
- [ ] 首页 + Level 选择
- [ ] Unit 列表页 + 进度显示
- [ ] 语法讲解页（静态卡片）
- [ ] 选择题组件
- [ ] 填空题组件
- [ ] 判断题组件
- [ ] localStorage 进度存储
- [ ] Level 1 Unit 1-3 的完整题库

### Phase 2: 核心功能（2-3 周）
- [ ] 拖拽排序题组件
- [ ] 配对连线题组件
- [ ] 图片选择题组件
- [ ] 星星评价系统
- [ ] 错题本功能
- [ ] 音效系统
- [ ] Level 1 全部 12 个 Unit 题库
- [ ] 单元测验模式

### Phase 3: 游戏化（1-2 周）
- [ ] 成就系统
- [ ] 连续学习打卡
- [ ] 动画和过渡效果
- [ ] 答题反馈动画

### Phase 4: 完善（1-2 周）
- [ ] Level 2 全部 12 个 Unit 题库
- [ ] 响应式适配（手机/平板）
- [ ] PWA 支持（离线使用）
- [ ] 性能优化

### 未来扩展
- [ ] Level 3-6 支持
- [ ] AI 智能出题（根据错题自动调整难度）
- [ ] 语音朗读功能
- [ ] 多用户支持（家长/老师角色）
- [ ] 学习数据分析和报告

---

## 11. 部署方案

### 推荐: Vercel（最简单）
```bash
# 安装 Vercel CLI
npm i -g vercel
# 部署
vercel
```

### 备选: GitHub Pages
```bash
# next.config.ts 中设置 basePath
# 使用 GitHub Actions 自动部署
npm run build  # 输出到 out/ 目录
```

### 备选: 本地使用
```bash
npm run build
npx serve out/   # 本地静态服务器
```

---

## 12. 设计原则总结

1. **学习为本**: 不是游戏，但用游戏化手段激励学习
2. **正向反馈**: 答对大力表扬，答错温柔鼓励
3. **循序渐进**: Unit 逐步解锁，难度递增
4. **重复练习**: 错题机制确保薄弱点被攻克
5. **简洁直观**: 小朋友不看说明书也能用
6. **离线可用**: 纯前端，不依赖网络（PWA）
