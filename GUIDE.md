# 🗺️ Roadmap de Implementação: Reviva Fotos (Fase Final)

> **Status:** UI/UX Front-end (Design Padrão Ouro) ✅ | Loader Otimizado (Spinner CSS) ✅
> **Objetivo de Amanhã:** Plugar o "encanamento do dinheiro", conectar as APIs de IA e blindar o traqueamento sem destruir o PageSpeed.

---

## 1. 💸 O Motor Financeiro (Integração Pagar.me)
*A ponte entre a emoção do usuário e o dinheiro na nossa conta.*
- [ ] **Modal de Checkout:** Configurar o botão azul na tela de resultado ("Desbloquear em Alta Resolução") para abrir o fluxo de pagamento do Pagar.me.
- [ ] **Lógica de Estado (Travado/Liberado):** Criar a variável `isPaid`. Se `false`, o download HD está bloqueado. Se `true`, o botão fica verde e baixa o `.jpg` limpo.
- [ ] **O Ouvido Biônico (Webhook):** Criar a rota `api/webhooks/pagarme`. 
  - Escutar o evento `order.paid`.
  - Atualizar o banco de dados e gerar a URL assinada/segura para o usuário baixar a foto sem marca d'água de forma automática.

## 2. 🧠 O Cérebro da Operação (Backend & APIs)
*Fazer o frontend conversar com o motor de IA.*
- [ ] **Conexão Frontend -> Backend:** Garantir que a foto upada pelo usuário dispare a requisição para a API de restauração (Gemini/Replicate) simultaneamente à abertura do Loader de 40s.
- [ ] **A Ponte do Timer:** Fazer o componente `LoadingScreen` escutar o timer. Quando bater `00:00`, desmontar o Loader e jogar o usuário para a `ResultScreen`.
- [ ] **Fallback de Segurança:** Se a API de IA demorar mais de 40s, travar o timer em `00:01s` e exibir texto "Finalizando detalhes..." até receber o status 200 do backend.

## 3. 👁️ A Vitrine de Conversão (UX da Tela de Resultado)
*Aqui é onde o cliente 50+ decide passar o cartão.*
- [ ] **Slider "Antes e Depois":** Implementar o componente de arrastar (linha divisória) para o usuário comparar a foto velha com a restaurada.
- [ ] **A Tranca Visual:** Aplicar a marca d'água (logo do Reviva) sobreposta na imagem de preview.
- [ ] **🚫 REGRA DE OURO UX:** *NUNCA* exibir mensagens como "Restaurado em XX segundos". Isso quebra a percepção de valor (ancoragem) do trabalho da IA.

## 4. 📈 O Trator de Dados (Traqueamento Ninja)
*Coletar os dados do "rato beta" sem perder o PageSpeed 99+.*
- [ ] **Google Tag Manager (GTM) & Meta Pixel:** Instalar os scripts de tracking.
- [ ] **O Hack de Performance:** Configurar o `Partytown` (ou usar `@next/third-parties/google` no Next.js) para rodar o GTM e o Pixel em um Web Worker (fora da thread principal). O site tem que continuar carregando em < 1 segundo.

## 5. 🚀 O Upsell Matador (LTV / Ticket Médio)
*Oferecer mais valor logo após a primeira compra.*
- [ ] **Ofertando Vídeo:** Na tela de sucesso pós-pagamento, exibir a oferta: *"Dar vida à memória: Transformar em Vídeo"*.
- [ ] **Integração Seedance Lite:** Conectar a foto recém-restaurada à API do Seedance para gerar o vídeo.
- [ ] **Plano B:** Deixar arquitetura pronta para gerar GIF via *Nano Banana 2* caso o Seedance esteja indisponível ou caro.

## 6. 🌐 Tráfego Orgânico (O Efeito WhatsApp)
*O público 50+ compartilha tudo. A vitrine tem que estar linda.*
- [ ] **OpenGraph Tags:** Configurar as meta tags de SEO e compartilhamento (`<meta property="og:image"...>`).
- [ ] **Banner de Link:** Garantir que o preview no WhatsApp mostre um card premium com a copy: *"Recupere as fotos antigas da família em segundos com IA"*.