# 🌟 VivaBem - Seu Companheiro de Saúde e Bem-Estar

Aplicativo completo de saúde focado no público brasileiro, desenvolvido com React + TypeScript + Tailwind CSS.

## ✨ Funcionalidades Principais

### 🎯 Onboarding Completo
- Cadastro personalizado com 5 etapas
- Coleta de dados: nome, idade, sexo, altura, peso atual e meta
- Definição de objetivos (perder peso, ganhar massa, manter peso, saúde geral)
- Nível de atividade física
- Registro opcional de medicamentos GLP-1 (Ozempic, Saxenda, etc.)

### 🏠 Dashboard Intuitivo
- Saudação personalizada com mascote animado
- Cards informativos com:
  - IMC calculado automaticamente
  - Peso atual vs. meta
  - Calorias consumidas no dia
  - Hidratação (copos de água)
- Mensagens motivacionais diárias
- Visão geral de todas as métricas importantes

### 💧 Rastreador de Água
- Meta diária calculada com base no peso e atividade
- Interface visual com indicador de progresso
- Registro rápido por quantidade (50ml, 200ml, 500ml, 1L)
- Contador de copos (8 copos de 200ml)
- Dicas de hidratação
- Benefícios de beber água

### 🍎 Registro de Refeições
- 6 tipos de refeições (café, lanches, almoço, jantar, ceia)
- Base de dados com 50+ alimentos brasileiros
- Busca inteligente de alimentos
- Informações nutricionais completas (calorias, proteínas, carboidratos, gorduras, fibras)
- Cálculo automático de totais por refeição
- Histórico diário de alimentação
- Preparado para foto e código de barras (em breve)

### ⏱️ Jejum Intermitente
- 4 protocolos prontos (16:8, 18:6, 20:4, 24h)
- Timer visual circular em tempo real
- Indicador de progresso percentual
- Tempo restante atualizado ao segundo
- Informações educativas sobre jejum
- Avisos de segurança e recomendações médicas

### 💪 Treinos em Casa
- 6 planos de treino completos:
  - Pilates Iniciante
  - Yoga para Relaxamento
  - Caminhada Ativa
  - Treino Corpo Todo
  - Yoga Power
  - Pilates Avançado
- Detalhamento de exercícios com descrições
- Contador de calorias queimadas
- Registro personalizado de treinos
- Histórico diário de atividades

### 📊 Progresso e Histórico
- Gráfico de evolução de peso (Recharts)
- Registro de pesagens com observações
- Cálculo automático de IMC por entrada
- Estatísticas de progresso
- Dicas motivacionais
- Exportação de dados em JSON

### ⚙️ Configurações
- Visualização completa do perfil
- Tema claro/escuro/automático
- Configurações de notificações
- Privacidade e LGPD:
  - Controle de compartilhamento de dados
  - Analytics opcional
  - Exportação de dados pessoais
  - Exclusão completa de dados
- Informações sobre LGPD e direitos do usuário

## 🎨 Design e UX

### Tema de Cores
- **Verde**: Cor primária (saúde, bem-estar, natureza)
- **Laranja**: Cor secundária (energia, motivação)
- **Sistema de cores adaptável**: Dark mode completo
- **Gradientes**: Evitados propositalmente para melhor desempenho

### Mascote Animado
- Personagem carismático circular com rosto sorridente
- Estados de humor (feliz, animado, celebrando, encorajando)
- Animações suaves (bounce, pulse)
- Balões de diálogo motivacionais
- Ícones contextuais

### Navegação Mobile-First
- Bottom tabs fixos com 5 seções principais
- Ícones intuitivos (Lucide React)
- Indicador visual da página ativa
- Transições suaves

## 🧮 Cálculos e Fórmulas

### IMC (Índice de Massa Corporal)
```
IMC = peso / (altura em metros)²
```
Classificação completa (abaixo do peso, normal, sobrepeso, obesidades I/II/III)

### TMB (Taxa Metabólica Basal)
Fórmula de Mifflin-St Jeor:
- Homens: `10 × peso + 6.25 × altura - 5 × idade + 5`
- Mulheres: `10 × peso + 6.25 × altura - 5 × idade - 161`

### TDEE (Gasto Energético Diário Total)
```
TDEE = TMB × multiplicador de atividade
```
Multiplicadores:
- Sedentário: 1.2
- Leve: 1.375
- Moderado: 1.55
- Intenso: 1.725
- Muito Intenso: 1.9

### Meta de Calorias
- Perder peso: TDEE - 500 kcal
- Ganhar massa: TDEE + 300 kcal
- Manter peso: TDEE
- Ajuste para medicamentos GLP-1 (redução adicional segura)
- Limite mínimo: 1200 kcal

### Macronutrientes
**Perder Peso:**
- Proteína: 1.8g/kg
- Gordura: 30% das calorias
- Carboidratos: 40% das calorias

**Ganhar Massa:**
- Proteína: 2.0g/kg
- Gordura: 25% das calorias
- Carboidratos: 45% das calorias

**Manutenção:**
- Proteína: 1.5g/kg
- Gordura: 30% das calorias
- Carboidratos: 40% das calorias

### Meta de Água
```
Base: peso × 35ml
+ 500ml se atividade intensa
+ 250ml se atividade moderada
```

## 🇧🇷 Características Brasileiras

### Alimentos
Base de dados com 50+ alimentos comuns no Brasil:
- Arroz e feijão (vários tipos)
- Tapioca, mandioca, inhame
- Frutas tropicais (mamão, açaí, manga, abacaxi)
- Pão francês, polenta
- Queijo minas, castanha do Pará
- Água de coco, café brasileiro

### Medidas
- Peso em quilogramas (kg)
- Altura em centímetros (cm)
- Líquidos em mililitros (ml)
- Porções em medidas brasileiras (xícara, colher, concha)

### Linguagem
- 100% em português brasileiro
- Tom acolhedor e motivacional
- Sem jargões técnicos desnecessários
- Explicações claras e acessíveis

## 🔒 Privacidade e Segurança (LGPD)

### Armazenamento Local
- Todos os dados salvos apenas no dispositivo do usuário
- localStorage do navegador
- Nenhum servidor externo
- Zero rastreamento não autorizado

### Direitos do Usuário
✅ Acesso completo aos dados
✅ Exportação em JSON
✅ Exclusão permanente
✅ Controle granular de permissões
✅ Transparência total

### Conformidade LGPD
- Lei nº 13.709/2018
- Consentimento explícito
- Finalidade clara
- Minimização de dados
- Portabilidade garantida

## 🏗️ Arquitetura Técnica

### Stack
- **React 19**: UI moderna e performática
- **TypeScript**: Type safety completo
- **Vite 7**: Build tool rápida
- **Tailwind CSS 4**: Estilização utility-first
- **shadcn/ui**: Componentes acessíveis
- **Recharts**: Gráficos interativos
- **React Router**: Navegação SPA
- **Sonner**: Notificações toast

### Estrutura de Pastas
```
src/
├── components/
│   ├── ui/           # 50+ componentes shadcn
│   ├── mascot.tsx    # Mascote animado
│   └── mobile-nav.tsx # Navegação bottom tabs
├── contexts/
│   └── AppContext.tsx # Estado global
├── data/
│   └── brazilian-foods.ts # Base de alimentos
├── lib/
│   ├── utils.ts      # Utilitários gerais
│   └── health-utils.ts # Cálculos de saúde
├── pages/
│   ├── Onboarding.tsx
│   ├── Dashboard.tsx
│   ├── WaterTracker.tsx
│   ├── Meals.tsx
│   ├── Fasting.tsx
│   ├── Workouts.tsx
│   ├── Progress.tsx
│   └── Settings.tsx
├── types/
│   └── index.ts      # Definições TypeScript
└── App.tsx           # Router principal
```

### Estado Global
Context API com localStorage persistence:
- Perfil do usuário
- Água do dia
- Refeições do dia
- Jejum ativo
- Treinos do dia
- Histórico de peso
- Configurações de privacidade
- Mensagem motivacional diária

### Performance
- Code splitting automático (Vite)
- Lazy loading de páginas
- Componentes otimizados
- Sem re-renders desnecessários
- localStorage como banco de dados (rápido e offline-first)

## 📱 Responsividade

### Mobile-First
- Design prioritário para smartphones
- Bottom navigation fixa
- Cards empilhados verticalmente
- Inputs touch-friendly (tamanho mínimo 44px)

### Tablet/Desktop
- Grid responsivo (2-4 colunas)
- Max-width controlado (não ultrapassar 1200px)
- Sidebar opcional em telas grandes
- Melhor aproveitamento de espaço horizontal

## 🎓 Aspectos Educacionais

### Segurança em Primeiro Lugar
- Limites saudáveis de calorias (mín. 1200 kcal)
- Alertas sobre jejum intermitente
- Recomendações para consultar médico
- Informações sobre medicamentos
- Linguagem sem culpa ou pressão

### Conteúdo Informativo
- Benefícios de cada funcionalidade
- Dicas práticas de saúde
- Explicações de conceitos (IMC, macros, etc.)
- Motivação positiva constante

## 🚀 Próximas Funcionalidades (Roadmap)

### Em Desenvolvimento
- 📸 Registro de refeições por foto (OCR)
- 🔢 Scanner de código de barras
- 📲 Notificações push (lembretes)
- 🏆 Sistema de conquistas e badges
- 📈 Relatórios semanais/mensais
- 👥 Compartilhamento de progresso
- 🔗 Integração com Supabase (opcional)

### Ideias Futuras
- Receitas saudáveis brasileiras
- Planos alimentares personalizados
- Integração com wearables
- Comunidade de suporte
- Desafios coletivos
- Coaching virtual com IA

## 🎉 Diferenciais

✅ **Completamente Offline**: Funciona sem internet
✅ **100% Gratuito**: Sem paywall ou assinaturas
✅ **Sem Cadastro**: Privacidade total
✅ **Culturalmente Relevante**: Feito para brasileiros
✅ **Baseado em Ciência**: Fórmulas validadas
✅ **Acessível**: Interface simples e clara
✅ **Motivacional**: Mascote e mensagens positivas
✅ **LGPD Compliant**: Conformidade total

---

**VivaBem** - Transformando saúde em hábito, um dia de cada vez! 💚
