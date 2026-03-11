# 📑 Post-Mortem: A Batalha do HTML Pelado (Reviva Fotos)

Este documento registra a auditoria forense e a resolução dos problemas de performance (FOUC, High Speed Index e CLS) enfrentados durante a integração do sistema de restauração de fotos e i18n.

---

## 💀 O Problema (O Frankenstein)

O projeto apresentava um comportamento errático de renderização, onde o conteúdo era entregue sem estilos (HTML Pelado) e levava segundos para se tornar interativo.

* **FOUC (Flash of Unstyled Content):** O site carregava sem CSS, "piscando" na tela.
* **Speed Index:** ~6.5s (Extremamente lento para uma Landing Page).
* **CLS (Cumulative Layout Shift):** 0.35 (Layout pulando drasticamente no carregamento).
* **Causa Raiz:** Arquitetura centralizada em Client Components e falta de pré-renderização estática das rotas de idioma.

---

## 🛠️ A Solução (The Holy Trinity of Performance)

A estabilidade foi alcançada através de três pilares fundamentais de infraestrutura Next.js:

### 1. Pré-renderização com `generateStaticParams`
Em vez de esperar o usuário entrar para decidir qual idioma mostrar, forçamos o Next.js a construir todas as versões (`/pt`, `/en`, `/es`) durante o build.
> **Resultado:** O HTML já nasce no servidor com os textos traduzidos e o CSS injetado. FOUC eliminado.

### 2. SSG Puro com `output: 'export'`
Configuramos o projeto para saída estática. Isso remove a dependência de processamento em tempo de execução para a casca do site.
> **Resultado:** Entrega instantânea via CDN (Edge) com Speed Index reduzido para a casa dos 2s.

### 3. Island Architecture (Arquitetura de Ilhas)
Removemos o `'use client'` da raiz da página (`app/[locale]/page.tsx`) e o mantivemos apenas nos componentes interativos (`BeforeAfterSlider`, `FloatingWhatsApp`).
> **Resultado:** O "chassi" do site é estático e leve, enquanto apenas o "motor" (slider) carrega JavaScript.

---

## 📊 Tabela de Performance (Lighthouse)

| Métrica | Estado Frankenstein | Estado Challenger (Atual) |
| :--- | :--- | :--- |
| **Performance Score** | 83 | **99** |
| **Speed Index** | 6.5s | **2.2s** |
| **CLS (Layout Shift)** | 0.35 | **0** |
| **LCP (Largest Contentful Paint)** | 4.2s | **1.1s** |

---

## 🧠 Lições de Engenharia Sênior

* **Imagens no Netlify:** O uso de `unoptimized={true}` no `next/image` é obrigatório para evitar que o servidor do Netlify tente re-processar imagens pesadas de IA, o que gera gargalos de 5 segundos.
* **Animações Assassinas:** Keyframes com `opacity: 0` em elementos "above-the-fold" (primeira tela) destroem a métrica de LCP. Elementos hero devem carregar de forma estática.
* **Pureza do Server Component:** Nunca coloque `useState` ou lógica de estado no `page.tsx` raiz se você busca performance. Empurre o estado para "ilhas" (componentes filhos).
* **Tailwind v4 Config:** Em ambientes Next.js 16+, a diretiva `@import "tailwindcss";` deve ser respeitada se o motor PostCSS estiver atualizado, evitando o rollback para diretivas v3 que quebram o build.

---

**Status Final:** ✅ Produção Pronta | ✅ 0 Bugs de Layout | ✅ Performance de Elite