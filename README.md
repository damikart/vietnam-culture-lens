# Vietnam Culture Lens — Lật Văn Hóa

**Vietnam Culture Lens** is a digital cultural exploration project that introduces Vietnamese culture through familiar everyday entry points: proverbs, words, customs, beliefs, symbols, and cultural regions.

The Vietnamese title, **Lật Văn Hóa**, can be understood as “turning culture over” or “flipping culture open.” The project invites readers to look beneath the surface of things they may already know, then discover the deeper cultural logic behind them through the perspectives of major Vietnamese scholars.

This repository is intended for both Vietnamese and international audiences: Vietnamese readers who want to revisit their own cultural background with fresh eyes, and global readers who want a thoughtful, research-informed introduction to Vietnam beyond tourist clichés.

---

## Why this project exists

Vietnamese culture is often introduced through food, festivals, landscapes, and historical milestones. These are important, but they do not fully explain the ways Vietnamese people think, speak, organize relationships, practice beliefs, and interpret the world.

**Vietnam Culture Lens** approaches culture as a layered system. A proverb is not only a saying. A word is not only a word. A ritual is not only a ritual. Each item can reveal patterns of language, social organization, agricultural life, folk religion, regional diversity, and historical adaptation.

The goal is to make Vietnamese cultural knowledge:

- **Accessible** — readable for non-specialists and international audiences.
- **Research-informed** — grounded in Vietnamese scholarly works.
- **Exploratory** — encouraging readers to move across related ideas instead of reading isolated entries.
- **Bilingual-friendly** — built around Vietnamese concepts while remaining understandable in English-language contexts.

---

## Core idea

The app starts from something familiar and then reveals deeper interpretive layers.

Examples of entry points include:

- A Vietnamese proverb.
- A commonly used Vietnamese word.
- A folk belief or custom.
- A cultural symbol.
- A regional cultural pattern.

Each entry is connected to one or more scholarly lenses, allowing readers to compare how different fields interpret Vietnamese culture.

---

## Scholarly lenses

The current version is structured around four Vietnamese scholars, each representing a different way of reading culture:

| Scholar | Main lens | Contribution in this project |
| --- | --- | --- |
| **Trần Ngọc Thêm** | Cultural systems and Vietnamese identity | Explains Vietnamese culture through systemic oppositions such as agricultural vs. nomadic culture, yin-yang thinking, community organization, and cultural adaptation. |
| **Trần Quốc Vượng** | Archaeology, anthropology, and historical geography | Grounds culture in material evidence, ecology, regional formation, village life, and the long continuity of Southeast Asian cultural layers. |
| **Cao Xuân Hạo** | Linguistics and Vietnamese thought | Reveals how the Vietnamese language reflects different structures of thought, especially through topic-comment grammar and the distinctiveness of Vietnamese expression. |
| **Ngô Đức Thịnh** | Folk belief and ethnology | Interprets Vietnamese spiritual life, especially Mother Goddess worship, folk religion, ritual systems, and the boundary between belief and superstition. |

The project does not treat any single scholar as the final authority. Instead, it presents Vietnamese culture as something that becomes richer when seen through multiple lenses.

---

## Main features

### Layered discovery

Each entry begins with a surface-level item, then lets the reader reveal deeper interpretations step by step.

This design reflects the central metaphor of the project: culture is not consumed all at once; it is uncovered layer by layer.

### Cross-referenced cultural map

Entries are connected through related concepts, domains, scholars, and categories. A proverb may lead to a linguistic idea, a belief may lead to a regional pattern, and a cultural symbol may lead to a broader worldview.

### Scholar-based navigation

Readers can browse all content through a specific scholar’s lens. This makes it possible to experience the project as a cultural map, a reading guide, or a lightweight scholarly index.

### Static-first architecture

The app is designed as a fast, content-driven website using static routes and JSON-based data. This makes it easy to deploy, maintain, and expand.

---

## Content categories

The current content is organized into three public-facing categories:

| Category | Vietnamese route | Description |
| --- | --- | --- |
| Proverbs | `/tuc-ngu` | Familiar sayings that reveal deeper cultural assumptions. |
| Words and terms | `/tu-ngu` | Everyday language viewed through cultural and linguistic meaning. |
| Beliefs, customs, and culture | `/tin-nguong` | Folk beliefs, symbols, comparisons, regions, and cultural frameworks. |

Internally, the data model supports several entity types, including concepts, misconceptions, terms, proverbs, comparisons, symbols, and cultural regions.

---

## Tech stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **JSON-based cultural dataset**

The project is intentionally lightweight. It does not depend on a database in the current version; cultural data is stored as structured JSON files and indexed at build time.

---

## Project structure

```txt
.
├── data/
│   ├── cao_xuan_hao.json
│   ├── ngo_duc_thinh.json
│   ├── tran_ngoc_them.json
│   └── tran_quoc_vuong.json
├── src/
│   ├── app/
│   │   ├── hoc-gia/
│   │   ├── tin-nguong/
│   │   ├── tuc-ngu/
│   │   └── tu-ngu/
│   ├── components/
│   │   ├── connections/
│   │   ├── explore/
│   │   ├── landing/
│   │   ├── scholar/
│   │   ├── share/
│   │   └── ui/
│   └── lib/
│       ├── data.ts
│       ├── scholars.ts
│       ├── slugify.ts
│       └── types.ts
├── package.json
└── tsconfig.json
```

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/damikart/vietnam-culture-lens.git
cd vietnam-culture-lens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Then open the local development URL shown in your terminal, usually:

```txt
http://localhost:3000
```

### 4. Build for production

```bash
npm run build
npm run start
```

---

## Data model overview

Each scholar has a dedicated JSON file under `data/`. The app imports these files, normalizes the entries, generates slugs, assigns categories, and builds cross-references between related ideas.

A simplified entity looks like this:

```ts
type IndexedEntity = {
  id: string;
  type: EntityType;
  slug: string;
  category: LandingCategory;
  scholarId: string;
  displayName: string;
  data: EntityData;
};
```

This structure allows the app to display the same cultural idea across multiple scholarly interpretations and connect related ideas across categories.

---

## Design principles

### Respect the source material

This project aims to make scholarly ideas accessible without flattening them into slogans.

### Start from familiarity

A reader should be able to enter the project through something simple: a proverb, a word, a ritual, or a symbol.

### Reveal complexity gradually

Instead of overwhelming readers with dense academic explanation, the interface reveals interpretation in layers.

### Keep Vietnamese concepts visible

Vietnamese terms are not treated as decorative translations. They are central to the cultural meaning of the project.

### Build for expansion

The project is designed so more scholars, regions, sources, and languages can be added over time.

---

## Possible future directions

- English-language summaries for each entry.
- Full bilingual Vietnamese-English interface.
- Search and filtering by scholar, domain, region, and concept.
- Visual concept graph for cultural relationships.
- More scholars and primary sources.
- Editorial notes explaining source interpretation.
- Exportable cultural reading paths for students and educators.

---

## Naming

The project uses the English-facing name **Vietnam Culture Lens** and the Vietnamese title **Lật Văn Hóa**.

Recommended display format:

```txt
Vietnam Culture Lens — Lật Văn Hóa
```

This keeps the project recognizable for Vietnamese readers while making it easier for international readers to understand and remember.

---

## About

Created as a digital cultural exploration project to introduce Vietnamese culture through scholarly perspectives, interactive reading, and connected cultural concepts.

The project is maintained by [@damikart](https://github.com/damikart).

---

## License

A license has not been specified yet. If this project is intended for public reuse, consider adding an open-source license such as MIT for code and a separate Creative Commons license for cultural content.
