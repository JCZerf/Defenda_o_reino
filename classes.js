// ========================================
// REINO ESTRATÉGICO - Sistema de Classes
// ========================================

// Sistema de Classes de Personagem
const CLASSES = {
  guerreiro: {
    nome: "Guerreiro",
    icone: "⚔️",
    descricao: "Alto dano físico e defesa, baixa velocidade",
    atributos: {
      forca: 18,
      agilidade: 8,
      inteligencia: 5,
      vitalidade: 15,
      defesaFisica: 12,
      defesaMagica: 4,
    },
    habilidades: [
      {
        nome: "Golpe Devastador",
        custo: { stamina: 15 },
        dano: { fisico: [20, 30] },
        cooldown: 3,
        descricao: "Ataque físico poderoso",
      },
      {
        nome: "Escudo Protetor",
        custo: { stamina: 10 },
        efeito: { defesaAumentada: 3 },
        cooldown: 2,
        descricao: "Aumenta defesa por 3 turnos",
      },
      {
        nome: "Berserker",
        custo: { vida: 10 },
        efeito: { danoAumentado: 5 },
        cooldown: 5,
        descricao: "Sacrifica vida por mais dano",
      },
    ],
    passiva: "Regeneração de 2 HP por turno em combate",
  },

  mago: {
    nome: "Mago",
    icone: "🔮",
    descricao: "Alto dano mágico, baixa defesa física",
    atributos: {
      forca: 5,
      agilidade: 10,
      inteligencia: 18,
      vitalidade: 8,
      defesaFisica: 3,
      defesaMagica: 15,
    },
    habilidades: [
      {
        nome: "Bola de Fogo",
        custo: { mana: 20 },
        dano: { magico: [25, 35] },
        cooldown: 2,
        descricao: "Projétil mágico devastador",
      },
      {
        nome: "Escudo Mágico",
        custo: { mana: 15 },
        efeito: { imunidadeMagica: 2 },
        cooldown: 4,
        descricao: "Imunidade a dano mágico por 2 turnos",
      },
      {
        nome: "Drenar Mana",
        custo: { mana: 10 },
        efeito: { drenagemMana: 15 },
        cooldown: 3,
        descricao: "Rouba mana do inimigo",
      },
    ],
    passiva: "Regeneração de 3 MP por turno",
  },

  arqueiro: {
    nome: "Arqueiro",
    icone: "🏹",
    descricao: "Alto dano físico à distância, muito ágil",
    atributos: {
      forca: 12,
      agilidade: 18,
      inteligencia: 10,
      vitalidade: 10,
      defesaFisica: 6,
      defesaMagica: 8,
    },
    habilidades: [
      {
        nome: "Tiro Certeiro",
        custo: { stamina: 12 },
        dano: { fisico: [18, 28] },
        precisao: 95,
        cooldown: 1,
        descricao: "Tiro de alta precisão",
      },
      {
        nome: "Chuva de Flechas",
        custo: { stamina: 25 },
        dano: { fisico: [12, 16] },
        ataques: 3,
        cooldown: 4,
        descricao: "Múltiplos ataques seguidos",
      },
      {
        nome: "Esquiva",
        custo: { stamina: 8 },
        efeito: { evasao: 2 },
        cooldown: 3,
        descricao: "Alta chance de esquiva por 2 turnos",
      },
    ],
    passiva: "15% chance de ataque crítico (2x dano)",
  },
};

// Sistema de Inimigos Estratégicos
const INIMIGOS = {
  goblin: {
    nome: "Goblin Ladino",
    nivel: 1,
    vida: 45,
    mana: 20,
    stamina: 60,
    atributos: {
      forca: 8,
      agilidade: 12,
      defesaFisica: 3,
      defesaMagica: 2,
    },
    resistencias: { fisico: 0, magico: -20 }, // -20% = mais fraco contra magia
    ataques: [
      { nome: "Punhalada", dano: [8, 12], tipo: "fisico", chance: 60 },
      { nome: "Veneno", dano: [5, 8], efeito: "envenenado", chance: 30 },
      { nome: "Esquivar", efeito: "evasao", chance: 10 },
    ],
    drops: { experiencia: 25, moedas: 15, items: ["pocao_pequena"] },
    ia: "agressivo", // Padrão de comportamento
  },

  orc: {
    nome: "Orc Guerreiro",
    nivel: 3,
    vida: 80,
    mana: 10,
    stamina: 100,
    atributos: {
      forca: 15,
      agilidade: 6,
      defesaFisica: 8,
      defesaMagica: 3,
    },
    resistencias: { fisico: 20, magico: -10 },
    ataques: [
      { nome: "Machada Pesada", dano: [15, 22], tipo: "fisico", chance: 50 },
      { nome: "Berserker", efeito: "furia", chance: 25 },
      { nome: "Investida", dano: [12, 18], efeito: "atordoar", chance: 25 },
    ],
    drops: {
      experiencia: 60,
      moedas: 35,
      items: ["pocao_media", "equipamento"],
    },
    ia: "defensivo",
  },

  mago_sombrio: {
    nome: "Mago das Sombras",
    nivel: 5,
    vida: 60,
    mana: 80,
    stamina: 40,
    atributos: {
      forca: 5,
      agilidade: 10,
      defesaFisica: 4,
      defesaMagica: 12,
    },
    resistencias: { fisico: -30, magico: 40 },
    ataques: [
      { nome: "Raio Sombrio", dano: [20, 30], tipo: "magico", chance: 40 },
      {
        nome: "Drenar Vida",
        dano: [15, 20],
        efeito: "cura_inimigo",
        chance: 30,
      },
      { nome: "Maldição", efeito: "debuff_todos", chance: 30 },
    ],
    drops: {
      experiencia: 120,
      moedas: 80,
      items: ["pergaminho", "pocao_mana"],
    },
    ia: "tatico",
  },
};

// Sistema de Equipamentos
const EQUIPAMENTOS = {
  armas: {
    espada_ferro: {
      nome: "Espada de Ferro",
      tipo: "arma",
      classe_permitida: ["guerreiro"],
      bonus: { forca: 5, dano_fisico: 8 },
      preco: 100,
    },
    cajado_madeira: {
      nome: "Cajado de Madeira",
      tipo: "arma",
      classe_permitida: ["mago"],
      bonus: { inteligencia: 6, dano_magico: 10 },
      preco: 120,
    },
    arco_élfico: {
      nome: "Arco Élfico",
      tipo: "arma",
      classe_permitida: ["arqueiro"],
      bonus: { agilidade: 4, dano_fisico: 6, precisao: 10 },
      preco: 150,
    },
  },
  armaduras: {
    armadura_couro: {
      nome: "Armadura de Couro",
      tipo: "armadura",
      classe_permitida: ["arqueiro", "mago"],
      bonus: { defesa_fisica: 3, agilidade: 2 },
      preco: 80,
    },
    armadura_ferro: {
      nome: "Armadura de Ferro",
      tipo: "armadura",
      classe_permitida: ["guerreiro"],
      bonus: { defesa_fisica: 10, vitalidade: 5 },
      preco: 200,
    },
  },
};

// Exportar para uso global
if (typeof window !== "undefined") {
  window.CLASSES = CLASSES;
  window.INIMIGOS = INIMIGOS;
  window.EQUIPAMENTOS = EQUIPAMENTOS;
}
