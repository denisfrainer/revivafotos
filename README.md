# Vibe Coder Boilerplate

A high-performance, i18n-ready starter kit built with **Next.js 16**, **TailwindCSS 4**, and **TypeScript**. Designed to clone and launch client websites (hotels, restaurants, shops) in under 24 hours.

## ⚡ Features

- **PageSpeed 99+** — SSG (Static Site Generation) out of the box
- **Multi-language (i18n)** — PT / EN / ES with `next-intl`, add more by creating a JSON file
- **Dark Mode Design System** — CSS custom properties, ready to theme
- **Optimized Fonts** — Google Fonts (Space Grotesk + Source Sans 3) via `next/font`
- **SEO Ready** — Meta tags, Open Graph, semantic HTML
- **Minimal & Clean** — Only the essentials, zero bloat

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | Framework (App Router, SSG) |
| React | 19 | UI Library |
| TailwindCSS | 4 | Styling |
| next-intl | 4 | Internationalization |
| lucide-react | — | Icons |
| TypeScript | 5 | Type Safety |

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone <your-repo-url> my-client-site
cd my-client-site

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

## 📁 Project Structure

```
├── app/
│   ├── [lang]/          # i18n dynamic routes
│   │   ├── layout.tsx   # NextIntlClientProvider wrapper
│   │   └── page.tsx     # Main page (Hero + Features + CTA)
│   ├── globals.css      # Design system (CSS variables)
│   ├── layout.tsx       # Root layout (fonts, metadata)
│   └── page.tsx         # Root redirect → /pt
├── components/
│   ├── Header.tsx       # Navigation bar + mobile menu
│   ├── HeroSection.tsx  # Hero section
│   ├── FeaturesSection.tsx # 3-column feature cards
│   ├── CTASection.tsx   # Call to action
│   ├── Footer.tsx       # Footer
│   ├── LanguageSwitcher.tsx # Language dropdown
│   └── MessagesProvider.tsx # i18n client provider
├── locales/
│   ├── en.json          # English translations
│   ├── pt.json          # Portuguese translations
│   └── es.json          # Spanish translations
├── lib/
│   └── utils.ts         # Tailwind class merge utility
├── i18n.ts              # next-intl configuration
├── middleware.ts        # i18n routing middleware
└── next.config.ts       # Next.js config (SSG, optimizeCss)
```

## 🌐 Adding a New Language

1. Create `locales/fr.json` (copy structure from `en.json`)
2. Add `'fr'` to the `locales` array in `i18n.ts`
3. Update the matcher in `middleware.ts` to include `fr`
4. Done! Visit `/fr` to see it

## 🎨 Customizing the Design

All design tokens live in `app/globals.css` as CSS custom properties:

```css
:root {
  --background: #000000;
  --foreground: #ededed;
  --primary: #1E1E1E;
  --accent-blue: #404EED;
  /* ... */
}
```

Change these values to instantly re-theme the entire site.

## 📦 Build for Production

```bash
npm run build
```

Output goes to `out/` — ready to deploy to Netlify, Vercel, or any static host.

## 📄 License

MIT


🏎️ GODSPEED KIT: The 1.5s Speed Index Chassis
Bem-vindo ao Godspeed Kit, o boilerplate definitivo para Next.js 16.1.6 construído sob a Arquitetura Challenger. Esse chassi foi refinado através de tentativas, erros e vitórias contra o Netlify e a hidratação do React para garantir performance "God-Tier".

📊 Performance Benchmark (Confirmed)
Speed Index: 1.5s

LCP (Largest Contentful Paint): 2.1s

TBT (Total Blocking Time): 10ms ~ 40ms

CLS (Cumulative Layout Shift): 0

Performance Score: 99/100

📜 Os Dogmas de Performance (O que superamos)
Para manter os 1.5s de velocidade, os seguintes dogmas devem ser respeitados:

1. O Dogma do Netlify-Safe (Anti-Ghosting)
A Regra: Nunca delete o arquivo app/layout.tsx na raiz física do projeto (fora da pasta [locale]).

O Porquê: Sem esse arquivo, o Netlify injeta seu próprio boilerplate ("Build Something Amazing"), causando FOUC e destruindo o Frame-0. Este arquivo deve ser um pass-through limpo que apenas importa o CSS global.

2. O Motor de LCP de Elite
A imagem principal (Hero/Slider) é o coração do seu LCP. Ela deve carregar com violência:

Atributos Obrigatórios: priority={true}, fetchPriority="high", loading="eager", decoding="sync".

Formato: Exclusivamente AVIF.

3. A "Armadilha do Logo" (The Logo Trap)
A Regra: Imagens secundárias (logos, ícones) NUNCA devem usar decoding="sync".

O Aprendizado: O uso de decodificação síncrona em elementos fora do LCP trava a Main Thread, degradando o Speed Index. Para o logo, use decodificação asíncrona (padrão) e evite prioridade de fetch.

4. O Padrão Squoosh (AVIF Masterclass)
Imagens são os maiores inimigos da performance. No Godspeed Kit, o padrão de exportação é:

Formato: AVIF

Quality: 50

Effort: 4

Meta: ~18kB para imagens de 800px+.

5. Hidratação Cirúrgica (Anti-FOUC)
A Regra: O NextIntlClientProvider deve envolver APENAS o {children} dentro do app/[locale]/layout.tsx.

A Estrutura: As tags <html> e <body> devem permanecer como Server Components puros. Isso garante que o CSS do Tailwind seja entregue no primeiro byte, evitando o "HTML Pelado".

6. Estabilidade de Estado (0ms TBT)
A Regra: O estado inicial de componentes interativos (ex: slider em 50%) deve ser hardcoded via inline CSS.

O Porquê: Isso garante que o servidor entregue o visual final antes mesmo do React acordar (hidratação), eliminando saltos de layout e reduzindo o tempo de bloqueio.

🛠️ Tech Stack
Framework: Next.js 16.1.6 (App Router)

Styling: Tailwind CSS v4

I18n: next-intl (Server-side optimized)

Infra: Netlify Optimized Configuration

Imagens: Next/Image + AVIF support

🚀 Como usar este Chassi
Instalação: npm install

Desenvolvimento: npm run dev

Build: npm run build

Netlify: Certifique-se de que o netlify.toml não possui redirecionamentos /* -> /index.html que causem conflitos de MIME type.

"Speed is the only feature that matters." - Toda vez que você pensar em adicionar uma biblioteca pesada, olhe para o Speed Index de 1.5s e mude de ideia.