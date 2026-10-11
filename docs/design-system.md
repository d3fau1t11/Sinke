# Senik Design System — "Quiet Luxury"

> Pass 1 + Pass 2 of the premium UI refresh (core flow, then all remaining screens).
> Rules below are **mandatory** for every new screen or component. Reviewers reject MRs that break them.

## 1. Design intent

Warm, calm, premium — the Ethiopian identity (terracotta, tibeb, bilingual AM/EN) stays,
but visual noise comes down: **borders are reserved for selection**, shadows are tiered,
type has a legibility floor, and every interactive target is thumb-friendly.

## 2. Color roles (from `tailwind.config.js`)

| Role                | Token                                      | Usage                                          |
| ------------------- | ------------------------------------------ | ---------------------------------------------- |
| Primary / selection | `#a73400` (terracotta)                     | CTAs, selected chips/cards, links, focus rings |
| Primary hover       | `#963000`                                  | Hover for any primary button                   |
| Success / live      | `#1b6d24`, container `#e8f5e9`             | Open badges, delivered, toggles ON, verified   |
| Tertiary / rating   | `#aa6400`, container `#fff4e6`             | Stars, ratings, review counts                  |
| Error               | `#ba1a1a`, container `#ffdad6`             | Destructive actions only                       |
| Text primary        | `#261911` (roasted buna, never pure black) | Headings, titles                               |
| Text secondary      | `#594139`                                  | Descriptions, labels                           |
| Text tertiary       | `#8d7168`                                  | Placeholders, disabled, chevrons               |
| Canvas              | `#fff8f5`                                  | Screen background                              |
| Card                | `#ffffff`                                  | Cards, inputs                                  |
| Tonal surface       | `#f6ede8` / `#ffeadf`                      | Unselected chips, icon tiles, segmented track  |
| Card hairline       | `#f3ebe6`                                  | Dividers **inside** cards only                 |
| Header/nav hairline | `#f1e7e1`                                  | Top/bottom nav borders only                    |
| Input border        | `#eadfd9`                                  | Inputs only                                    |

## 3. Core rules (do / don't)

**Cards**

- ✅ `bg-white rounded-2xl shadow-level-1` — **no border**
- ✅ Elevated/interactive: `shadow-level-2`, hover on tappable cards
- ❌ Never `border border-[#e1bfb5]` on cards — borders mean _selected_ or _input_

**Selection** (single pattern everywhere)

- Cards/options: `border-2 border-transparent` → selected `border-2 border-[#a73400]` + `bg-[#fff1eb]`
- Radio/checkbox fills: `bg-[#a73400] border-[#a73400] text-white`; unchecked `border-[#c9b5ac]`

**Chips** (pills: `rounded-full px-3.5 py-1.5 text-[13px] font-semibold`)

- Off: `bg-[#f6ede8] text-[#594139] hover:bg-[#ffeadf]`
- On (primary filter): `bg-[#a73400] text-white` + soft shadow
- On (secondary filter): `bg-[#261911] text-white`
- ❌ No outlined chips (`border` + white bg)

**Buttons**

- Primary CTA (min 48px): `bg-[#a73400] hover:bg-[#963000] text-white font-bold py-4 rounded-2xl shadow-[0_16px_36px_-14px_rgba(167,52,0,0.6)] active:scale-[0.98] text-[15px]`
- Tonal: `bg-[#fff1eb] text-[#a73400] font-bold` (no border)
- Dark/neutral: `bg-[#261911] hover:bg-[#3c2d25] text-white`
- Icon buttons ≥ 40×40px; stepper buttons `w-8 h-8`

**Inputs** (15px text — also prevents iOS zoom)

- `bg-white rounded-xl border border-[#eadfd9] px-3.5 py-3 text-[15px]`
- Focus: `focus:border-[#a73400] focus:ring-4 focus:ring-[#a73400]/10 outline-none`

**Segmented tabs** (All/Active/Past, All/Items/Businesses)

- Track: `bg-[#f6ede8] p-1 rounded-xl`; active: `bg-white text-[#a73400] shadow-level-1`
- No borders, `py-2`, `text-[13px]`

**Section headers**

- Screen section title: `font-display font-extrabold text-[17px] text-[#261911]`
- In-card header: `font-display font-bold text-[14px] uppercase tracking-[0.05em]` + 19px terracotta icon

**Prices / numbers**

- Always `tnum` (tabular-nums) + `font-display font-extrabold text-[#a73400]`

## 4. Typography scale

| Level            | Size           | Rule                      |
| ---------------- | -------------- | ------------------------- |
| Display headline | 24–26px        | One per screen max        |
| Section title    | 17px extrabold | Screen sections           |
| Card title       | 14–16px bold   | Item/order/store names    |
| Body             | **13–15px**    | Floor for meaningful text |
| Caption          | 12px           | Secondary descriptions    |
| Micro label      | 10–11px        | UPPERCASE tracking only   |

- ❌ No meaningful text below 12px; no `text-[9px]`
- Fonts: **Plus Jakarta Sans** (display), **Inter** (body), **Noto Sans Ethiopic** (ፋ ድ ግ) — never a 4th face

## 5. Shadows (elevation)

| Token                           | Use                                                               |
| ------------------------------- | ----------------------------------------------------------------- |
| `shadow-level-1`                | Resting cards, chips, tiles                                       |
| `shadow-level-2`                | Hover cards, floating pills, promo hero                           |
| `shadow-level-3` / `shadow-2xl` | Modals, splash logo                                               |
| CTA custom                      | `shadow-[0_16px_36px_-14px_rgba(167,52,0,0.6)]` (terracotta glow) |

- ❌ **`shadow-xs` and `shadow-2xs` do not exist in this config** — they silently render nothing.
  The codebase was cleaned of them; do not reintroduce.

## 6. Motion

- Press feedback: `active:scale-[0.98]` (cards) / `active:scale-95` (buttons)
- State changes: `transition-all`/`transition-colors` 200–300ms
- Live indicators: `animate-pulse` on status dots only (never on badges)
- Animate transform/opacity only; respect `prefers-reduced-motion` (add rules before adding new loops)

## 7. Accessibility (WCAG 2.1 AA)

- Global `:focus-visible` ring (terracra 2px) is defined in `src/index.css` — don't override with `outline-none` alone
- Every icon-only button needs `aria-label`
- Toggle: `role="switch"` + `aria-checked`
- Body contrast ≥ 4.5:1 — never `text-[#8d7168]` on `#fff1eb` for required text
- Touch targets ≥ 44px for primary actions; 32px minimum for steppers

## 8. Tailwind gotchas (validated by grep)

- Opacity modifiers must exist in the default scale: `/5 /10 /20 /25 /30 /40 /50 /60 /70 /75 /80 /90 /95 /100`.
  ❌ `/15`, `/55`, `/12` etc. silently drop the class.
- Radius scale has no `xs`: use `rounded-sm` (4px), `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`.
- Custom shadows: only `level-1/2/3`, `floating` (plus Tailwind defaults).

## 9. File conventions (AGENTS.md)

- Components ≤ 150 lines, **one component per file**, no barrel exports
- Components: presentational, props only (no async, no Supabase)
- Hooks/services own logic; `packages/api` owns Supabase
- Run `pnpm verify` before commit

## 10. Screen status

Pass 1 (core flow): Home, Search, Business Detail, Cart, Checkout, Order Tracking ✅
Pass 2 (everything): Splash, Onboarding, Location Select, Business List, Orders, Profile,
Order Confirmation, Product modal, Rider chat/call modal, Toast ✅
