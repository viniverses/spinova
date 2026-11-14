import type { Ionicons } from "@expo/vector-icons";

export type HelpSection = {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tips?: string[];
};

export type HelpFAQ = {
  question: string;
  answer: string;
};

export type HelpTopicDetail = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  badge: string;
  sections: HelpSection[];
  faqs: HelpFAQ[];
};

export const HELP_TOPICS: Record<string, HelpTopicDetail> = {
  returns: {
    id: "returns",
    label: "Política de troca e devolução",
    icon: "swap-horizontal",
    title: "Trocas e Devoluções",
    subtitle: "Garantia total para colecionadores e amantes do som analógico",
    badge: "Garantia Spinova",
    sections: [
      {
        title: "Direito de Arrependimento (7 Dias)",
        description:
          "Se você comprou um vinil e mudou de ideia, pode solicitar a devolução em até 7 dias corridos após o recebimento. O disco deve estar com o lacre original de fábrica inviolado e a embalagem em perfeito estado.",
        icon: "refresh-outline",
        tips: [
          "O lacre plástico não pode ter sido rompido.",
          "O produto deve retornar com todos os encartes, pôsteres e adesivos originais.",
          "O estorno é integral, incluindo o valor do frete pago.",
        ],
      },
      {
        title: "Defeitos de Prensagem e Pulos de Faixa",
        description:
          "Sabemos que prensagens de vinil podem eventualmente apresentar anomalias físicas ou acústicas. Se o seu exemplar lacrado apresentar defeito sonoro real (como faixas pulando ou estalidos graves repetitivos) em toca-discos calibrados, realizamos a substituição sem custo.",
        icon: "disc-outline",
        tips: [
          "Verifique se o peso do braço (tracking force) e o anti-skating estão regulados.",
          "Grave um pequeno vídeo demonstrando o defeito em reprodução.",
          "Solicite a troca em até 30 dias após o recebimento.",
        ],
      },
      {
        title: "Avarias no Transporte (Capas Amassadas)",
        description:
          "Enviamos todos os pedidos em caixas 'Armor' reforçadas, mas se os Correios ou a transportadora danificarem a embalagem e a capa do disco amassar ou rasgar (seam split), efetuaremos a troca imediata.",
        icon: "shield-outline",
        tips: [
          "Fotografe a caixa externa antes de descartar.",
          "Envie fotos do detalhe do dano na capa.",
        ],
      },
    ],
    faqs: [
      {
        question: "Como inicio um pedido de troca?",
        answer:
          "Acesse seu histórico de pedidos no perfil do app, selecione o pedido em questão e toque em 'Solicitar Suporte' ou entre em contato pelo nosso canal oficial de atendimento.",
      },
      {
        question: "Quem paga o frete na devolução por defeito?",
        answer:
          "O frete de logística reversa é 100% por nossa conta! Enviamos um código de postagem sem custo para você postar nos Correios.",
      },
      {
        question: "Quanto tempo leva o estorno?",
        answer:
          "No PIX, o estorno ocorre em até 2 horas após a conferência do item em nosso depósito. No cartão de crédito, o comprovante é enviado em até 2 dias úteis e o crédito aparecerá em até duas faturas.",
      },
    ],
  },
  payments: {
    id: "payments",
    label: "Formas de pagamento",
    icon: "card-outline",
    title: "Formas de Pagamento",
    subtitle: "Praticidade, condições especiais e segurança em cada pedido",
    badge: "Pagamento Seguro",
    sections: [
      {
        title: "PIX com 5% de Desconto",
        description:
          "Pague via PIX e ganhe 5% de desconto automático no valor dos discos. A aprovação é imediata e seu pedido entra em separação prioritária na nossa expedição.",
        icon: "flash-outline",
        tips: [
          "O QR Code e o código Copia e Cola têm validade de 30 minutos.",
          "A confirmação é automática, não precisa enviar comprovante.",
        ],
      },
      {
        title: "Cartão de Crédito em até 10x",
        description:
          "Parcele suas compras em até 10x sem juros (ou até 12x com acréscimo). Aceitamos as principais bandeiras nacionais e internacionais.",
        icon: "card-outline",
        tips: [
          "Bandeiras aceitas: Visa, Mastercard, Elo, American Express e Hipercard.",
          "Análise antifraude em tempo real com liberação rápida.",
        ],
      },
      {
        title: "Boleto Bancário",
        description:
          "Para compras no boleto, o vencimento é de 3 dias úteis. Seu vinil fica reservado no estoque durante todo esse período enquanto aguardamos a compensação bancária.",
        icon: "receipt-outline",
        tips: [
          "A compensação pode levar de 24h a 48h úteis.",
          "Pague em qualquer agência, lotérica ou aplicativo de banco.",
        ],
      },
    ],
    faqs: [
      {
        question: "Posso parcelar no PIX?",
        answer:
          "O pagamento via PIX no app é à vista, aproveitando o desconto especial de 5% no catálogo.",
      },
      {
        question: "É seguro colocar meu cartão no app?",
        answer:
          "Totalmente seguro! Seus dados de cartão são tokenizados diretamente pelo gateway de pagamento com certificação PCI-DSS nível 1. A Spinova não tem acesso nem armazena os dígitos do seu cartão.",
      },
      {
        question: "O que acontece se o boleto vencer?",
        answer:
          "Se o boleto não for pago até o vencimento, o pedido é cancelado automaticamente e o disco retorna para o estoque da loja.",
      },
    ],
  },
  delivery: {
    id: "delivery",
    label: "Tipos de entrega",
    icon: "bicycle-outline",
    title: "Envios e Embalagem",
    subtitle: "Embalagem reforçada feita sob medida para discos de vinil",
    badge: "Envio Especializado",
    sections: [
      {
        title: "Embalagem Blindada para Vinil",
        description:
          "Discos de vinil são itens frágeis e preciosos. Desenvolvemos caixas de papelão onda dupla ultra-resistentes, com cantoneiras rígidas e plástico-bolha sob medida para absorver impactos e impedir cantos amassados ou vincos nas capas.",
        icon: "cube-outline",
        tips: [
          "Caixas rígidas 'Mailing Armor' exclusivas para LPs de 12 pol.",
          "Proteção extra nos 4 cantos da embalagem.",
          "Opção de envio do disco fora da capa para colecionadores exigentes.",
        ],
      },
      {
        title: "Opções de Frete Disponíveis",
        description:
          "Trabalhamos com os Correios e transportadoras expressas privadas para garantir agilidade e cobertura em todo o território nacional.",
        icon: "airplane-outline",
        tips: [
          "SEDEX Express: 1 a 3 dias úteis para principais capitais.",
          "PAC / Transportadora: opção econômica com rastreamento completo.",
          "Frete Grátis: disponível em campanhas promocionais para diversas regiões.",
        ],
      },
      {
        title: "Rastreamento Passo a Passo",
        description:
          "Assim que seu pedido é conferido e embalado, você recebe o código de rastreio com notificações de cada etapa até a entrega no seu endereço.",
        icon: "location-outline",
        tips: [
          "Acompanhe o trajeto diretamente na aba Perfil do app.",
          "Receba avisos por e-mail a cada atualização de status.",
        ],
      },
    ],
    faqs: [
      {
        question: "Vocês enviam o disco fora da capa interna?",
        answer:
          "Sim! Para evitar o rompimento das bordas da capa (seam split) causado pelo atrito do vinil durante o trajeto, você pode solicitar o envio do disco fora da capa no campo de observações do checkout.",
      },
      {
        question: "Qual o prazo de postagem?",
        answer:
          "Pedidos com pagamento confirmado até às 13h em dias úteis são postados em até 24 horas úteis.",
      },
      {
        question: "Vocês realizam envios internacionais?",
        answer:
          "Atualmente realizamos envios para todo o Brasil. Em breve disponibilizaremos remessas para outros países da América Latina.",
      },
    ],
  },
  security: {
    id: "security",
    label: "Segurança e privacidade",
    icon: "shield-checkmark-outline",
    title: "Segurança e Privacidade",
    subtitle: "Seus dados e sua coleção protegidos com os mais altos padrões",
    badge: "100% Protegido",
    sections: [
      {
        title: "Criptografia SSL de 256 Bits",
        description:
          "Toda a comunicação entre o aplicativo e nossos servidores é criptografada utilizando protocolo SSL/TLS de ponta a ponta, garantindo sigilo absoluto das suas informações pessoais.",
        icon: "lock-closed-outline",
        tips: [
          "Certificados de segurança de última geração.",
          "Ambiente verificado e protegido contra acessos não autorizados.",
        ],
      },
      {
        title: "Conformidade com a LGPD",
        description:
          "Cumprimos rigorosamente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Seus dados cadastrais são utilizados exclusivamente para o faturamento e entrega dos seus pedidos.",
        icon: "document-text-outline",
        tips: [
          "Nunca compartilhamos nem vendemos dados para terceiros.",
          "Você pode solicitar a exclusão de seus dados a qualquer momento.",
        ],
      },
      {
        title: "Autenticidade Garantida dos Produtos",
        description:
          "Todos os títulos do catálogo Spinova são 100% originais, adquiridos diretamente de gravadoras oficiais e distribuidoras internacionais credenciadas. Não comercializamos réplicas ou bootlegs piratas.",
        icon: "checkmark-circle-outline",
        tips: [
          "Prensagens oficiais seladas de fábrica.",
          "Procedência comprovada e nota fiscal em todos os pedidos.",
        ],
      },
    ],
    faqs: [
      {
        question: "Como meus dados de login são armazenados?",
        answer:
          "Utilizamos criptografia com hash seguro e tokens autenticados via Secure Store nativo do seu dispositivo iOS/Android.",
      },
      {
        question: "A Spinova guarda os dados do meu cartão?",
        answer:
          "Não. O processamento é efetuado diretamente pelas credenciadoras de cartão com tokenização PCI-DSS, garantindo que ninguém na Spinova tenha acesso aos seus dados financeiros.",
      },
    ],
  },
  other: {
    id: "other",
    label: "Outras dúvidas",
    icon: "help-circle-outline",
    title: "Guia do Vinil & Outras Dúvidas",
    subtitle: "Informações essenciais sobre gramatura, prensagens e cuidados",
    badge: "Guia do Colecionador",
    sections: [
      {
        title: "O que é Vinil 180g (Heavyweight)?",
        description:
          "Discos de 180 gramas são mais pesados e espessos que os vinis convencionais (120-140g). Essa massa extra confere maior estabilidade mecânica no prato, reduz vibrações espúrias e torna o disco significativamente mais resistente a empenamentos causados por variações térmicas.",
        icon: "disc-outline",
        tips: [
          "Mais durabilidade para sua coleção a longo prazo.",
          "Menos suscetível a ondulações e ressonâncias indesejadas.",
        ],
      },
      {
        title: "Como Cuidar e Armazenar seus Discos",
        description:
          "O vinil dura gerações quando armazenado e manuseado com carinho. Siga estas recomendações básicas para manter a qualidade sonora impecável:",
        icon: "heart-outline",
        tips: [
          "Guarde sempre na posição vertical (em pé), nunca empilhado horizontalmente.",
          "Evite exposição ao sol direto, fontes de calor e locais úmidos.",
          "Use escova antiestática de fibra de carbono antes de cada audição.",
          "Pegue no disco apenas pelas bordas e pelo selo central (nunca toque nos sulcos).",
        ],
      },
      {
        title: "Prensagens Coloridas e Picture Discs",
        description:
          "Vinis coloridos e marmorizados possuem excelente fidelidade sonora nas prensagens modernas. Já os Picture Discs (discos com imagem impressa sob uma camada fina de filme) possuem naturalmente um ruído de fundo (noise floor) levemente superior, sendo muito valorizados como itens estéticos de coleção.",
        icon: "color-palette-outline",
        tips: [
          "Discos coloridos mantêm o mesmo alto padrão de prensagem tradicional.",
          "Picture discs são ideais tanto para reprodução quanto para decoração e coleção.",
        ],
      },
      {
        title: "Como Funcionam as Pré-Vendas?",
        description:
          "Ao garantir um título em pré-venda, sua cópia fica 100% reservada. O envio é realizado assim que o lote chega ao nosso centro de distribuição, respeitando a data oficial de lançamento.",
        icon: "time-outline",
        tips: [
          "A data prevista de postagem é informada na página do produto.",
          "Se seu pedido contiver itens pronta entrega e pré-venda, o envio será feito junto.",
        ],
      },
    ],
    faqs: [
      {
        question: "Um disco lacrado pode vir empenado de fábrica?",
        answer:
          "Pode acontecer em casos raros devido a tensões de resfriamento na fábrica. Se isso afetar a reprodução da música no seu equipamento, nossa garantia de troca cobre prontamente.",
      },
      {
        question: "Como saber se o vinil é remasterizado?",
        answer:
          "As informações técnicas de masterização, corte em meia velocidade (half-speed) ou fontes analógicas são descritas na ficha de cada produto.",
      },
      {
        question: "Não encontrei o título que procuro, vocês encomendam?",
        answer:
          "Sim! Envie uma mensagem pelo botão 'Converse com a gente' que nossa equipe de curadoria verifica a possibilidade de encomenda com nossos fornecedores internacionais.",
      },
    ],
  },
};

export const getAllHelpTopics = (): HelpTopicDetail[] =>
  Object.values(HELP_TOPICS);

export const getHelpTopicById = (id: string): HelpTopicDetail | undefined =>
  HELP_TOPICS[id] ?? HELP_TOPICS.other;
