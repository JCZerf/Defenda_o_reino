// Sistema de jogo estratégico "A Lenda do Reino Perdido"
let estadoJogo = {
  jogador: {
    nome: "Herói",
    vida: 100,
    vidaMaxima: 100,
    mana: 50,
    manaMaxima: 50,
    stamina: 100,
    staminaMaxima: 100,
    nivel: 1,
    experiencia: 0,
    moedas: 50,
    moral: 50, // Afeta eficácia das ações
    reputacao: "Desconhecido",
    inventario: {
      pocoesCura: 2,
      pocoesMana: 2,
      armaduraBonus: 0,
      armaBonus: 0,
      pergaminhos: 0,
    },
    habilidades: {
      ataqueDuplo: false,
      curaAvancada: false,
      bloqueioPerfeito: false,
      analisarInimigo: false,
    },
    statusEfeitos: {
      envenenado: 0,
      regeneracao: 0,
      fury: 0,
      defesaAumentada: 0,
    },
  },
  inimigoAtual: null,
  combateAtivo: false,
  fase: 1,
  capitulo: 1,
  escolhasFeitas: [],
  historiasDesbloqueadas: [],
  escolhaAtual: null, // Array das escolhas disponíveis no momento

  // Sistema de inimigos inteligentes
  inimigos: {
    goblin: {
      nome: "Goblin Trapaceiro",
      vida: 60,
      vidaMaxima: 60,
      dano: [8, 12],
      defesa: 2,
      padroes: ["ataque", "esquiva", "ataque", "habilidadeEspecial"],
      habilidadeEspecial: "veneno",
      fraqueza: "magia",
      resistencia: "fisico",
      descricao: "Um goblin astuto que usa veneno e esquivas.",
      experiencia: 25,
      moedas: 15,
      dropChance: { pocao: 0.3, pergaminho: 0.1 },
    },
    orc: {
      nome: "Orc Berserker",
      vida: 120,
      vidaMaxima: 120,
      dano: [15, 22],
      defesa: 5,
      padroes: ["ataque", "ataque", "furia", "ataque"],
      habilidadeEspecial: "furia",
      fraqueza: "precisao",
      resistencia: "brutal",
      descricao: "Um orc selvagem que fica mais forte conforme se machuca.",
      experiencia: 40,
      moedas: 25,
      dropChance: { pocao: 0.2, arma: 0.15 },
    },
    necromante: {
      nome: "Necromante Sombrio",
      vida: 80,
      vidaMaxima: 80,
      dano: [12, 18],
      defesa: 3,
      padroes: ["magia", "invocar", "drenarVida", "magia"],
      habilidadeEspecial: "drenarVida",
      fraqueza: "luz",
      resistencia: "sombra",
      descricao: "Mago das trevas que drena vida e invoca mortos-vivos.",
      experiencia: 60,
      moedas: 40,
      dropChance: { pergaminho: 0.4, mana: 0.3 },
    },
    dragao: {
      nome: "Dragão Ancião",
      vida: 300,
      vidaMaxima: 300,
      dano: [25, 40],
      defesa: 15,
      padroes: ["respirar", "voar", "ataque", "intimidar"],
      habilidadeEspecial: "respiraoDeFogo",
      fraqueza: "gelo",
      resistencia: "fogo",
      descricao:
        "O terror dos céus, com escalas impenetráveis e chamas devastadoras.",
      experiencia: 150,
      moedas: 100,
      dropChance: { tesouro: 0.8, habilidade: 0.5 },
    },
  },

  // Sistema de história dinâmica
  historia: {
    prologo: {
      texto:
        "Nas terras místicas de Eldoria, as sombras começam a se espalhar. Você é um jovem guerreiro chamado para defender o último bastião da esperança. Mas primeiro, deve escolher seu caminho...",
      escolhas: [
        {
          texto: "🗡️ Seguir o caminho do guerreiro (+ Força, - Mana)",
          efeito: { stamina: 20, mana: -10, habilidade: "ataqueDuplo" },
          consequencia: "guerreiro",
        },
        {
          texto: "🔮 Estudar as artes arcanas (+ Mana, - Stamina)",
          efeito: { mana: 20, stamina: -10, habilidade: "analisarInimigo" },
          consequencia: "mago",
        },
        {
          texto: "⚖️ Buscar o equilíbrio (Stats balanceados)",
          efeito: { vida: 10, mana: 5, stamina: 5, habilidade: "curaAvancada" },
          consequencia: "equilibrio",
        },
      ],
    },
    capitulos: [
      {
        titulo: "O Despertar das Sombras",
        eventos: [
          {
            texto:
              "Você encontra uma vila sendo atacada por goblins. Os gritos ecoam pela noite. O que fará?",
            escolhas: [
              {
                texto:
                  "💨 Atacar imediatamente (Combate difícil, +Moral dos aldeões)",
                efeito: { moral: 10, reputacao: "Heroico" },
                combate: "goblin",
                dificuldade: 1.2,
              },
              {
                texto:
                  "🎭 Planejar uma estratégia (Usar stamina, combate mais fácil)",
                efeito: { stamina: -20, moral: 5 },
                combate: "goblin",
                dificuldade: 0.8,
              },
              {
                texto:
                  "🕵️ Investigar primeiro (Descobrir fraqueza, sem combate imediato)",
                efeito: { experiencia: 10 },
                revelarInfo: "goblin",
                combate: false,
              },
            ],
          },
        ],
      },
      {
        titulo: "O Chamado da Floresta Sombria",
        eventos: [
          {
            texto:
              "Um comerciante desesperado oferece uma recompensa para eliminar orcs que bloqueiam a estrada comercial. Mas algo não parece certo...",
            escolhas: [
              {
                texto: "💰 Aceitar a missão (+50 moedas, combate contra orcs)",
                efeito: { moedas: 50 },
                combate: "orc",
              },
              {
                texto:
                  "❓ Investigar o comerciante (Revelação: ele está mentindo)",
                efeito: { experiencia: 25, moral: 10 },
                revelarSegredo: "comerciante_corrupto",
              },
              {
                texto:
                  "🚫 Recusar e seguir viagem (Evitar problema, mas perder oportunidade)",
                efeito: { moral: -5 },
                proximoEvento: "encontro_alternativo",
              },
            ],
          },
        ],
      },
    ],
  },
};

// Turnos do inimigo com padrões específicos
let turnoInimigo = 0;
let cooldowns = {
  ataqueDuplo: 0,
  curaAvancada: 0,
  bloqueio: 0,
  analisar: 0,
};

// Funções de utilidade melhoradas
function calcularDano(min, max, bonus = 0, multiplicador = 1) {
  const danoBase = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.floor((danoBase + bonus) * multiplicador);
}

function aplicarStatusEfeito(efeito, duracao) {
  estadoJogo.jogador.statusEfeitos[efeito] = duracao;
  atualizarInterface();
}

function processarStatusEfeitos() {
  const efeitos = estadoJogo.jogador.statusEfeitos;

  if (efeitos.envenenado > 0) {
    estadoJogo.jogador.vida = Math.max(1, estadoJogo.jogador.vida - 5);
    exibirMensagem("💚 O veneno causa 5 de dano!", "negativo");
    efeitos.envenenado--;
  }

  if (efeitos.regeneracao > 0) {
    estadoJogo.jogador.vida = Math.min(
      estadoJogo.jogador.vidaMaxima,
      estadoJogo.jogador.vida + 8
    );
    exibirMensagem("✨ Regeneração restaura 8 de vida!", "positivo");
    efeitos.regeneracao--;
  }

  if (efeitos.defesaAumentada > 0) {
    efeitos.defesaAumentada--;
  }
}

function reduzirCooldowns() {
  for (let habilidade in cooldowns) {
    if (cooldowns[habilidade] > 0) {
      cooldowns[habilidade]--;
    }
  }
}

function exibirMensagem(mensagem, tipo = "normal") {
  const historiaElement = document.getElementById("historia");
  const classeCSS =
    tipo === "positivo"
      ? "mensagem-positiva"
      : tipo === "negativo"
      ? "mensagem-negativa"
      : "";

  historiaElement.innerHTML = `<div class="${classeCSS}">${mensagem}</div>`;
  historiaElement.style.opacity = "0";
  setTimeout(() => {
    historiaElement.style.opacity = "1";
  }, 100);
}

function exibirHistoriaComEscolhas(texto, escolhas) {
  exibirMensagem(texto);

  // Armazenar as escolhas atuais para uso posterior
  estadoJogo.escolhaAtual = escolhas;

  setTimeout(() => {
    let opcoesHTML = "";
    escolhas.forEach((escolha, index) => {
      const custoTexto = escolha.custo
        ? ` (${escolha.custo.tipo}: ${escolha.custo.valor})`
        : "";
      const disponivel = verificarDisponibilidade(escolha.custo);
      const classeBtn = disponivel ? "btn-escolha" : "btn-indisponivel";

      opcoesHTML += `<button onclick="executarEscolha(${index})" class="${classeBtn}" ${
        !disponivel ? "disabled" : ""
      }">
                ${escolha.texto}${custoTexto}
            </button>`;
    });
    document.getElementById("opcoes").innerHTML = opcoesHTML;
  }, 1000);
}

function verificarDisponibilidade(custo) {
  if (!custo) return true;

  switch (custo.tipo) {
    case "stamina":
      return estadoJogo.jogador.stamina >= custo.valor;
    case "mana":
      return estadoJogo.jogador.mana >= custo.valor;
    case "vida":
      return estadoJogo.jogador.vida > custo.valor;
    case "moedas":
      return estadoJogo.jogador.moedas >= custo.valor;
    default:
      return true;
  }
}

function executarEscolha(indice) {
  console.log(
    "🎯 Executando escolha:",
    indice,
    "Estado atual:",
    estadoJogo.escolhaAtual
  );

  // Verificação de segurança
  if (!estadoJogo.escolhaAtual || !estadoJogo.escolhaAtual[indice]) {
    console.error("❌ Escolha inválida ou não definida:", indice);
    return;
  }

  const escolhaAtual = estadoJogo.escolhaAtual;
  const escolha = escolhaAtual[indice];

  console.log("✅ Escolha válida:", escolha);

  // Aplicar custos
  if (escolha.custo) {
    switch (escolha.custo.tipo) {
      case "stamina":
        estadoJogo.jogador.stamina -= escolha.custo.valor;
        break;
      case "mana":
        estadoJogo.jogador.mana -= escolha.custo.valor;
        break;
      case "moedas":
        estadoJogo.jogador.moedas -= escolha.custo.valor;
        break;
    }
  }

  // Aplicar efeitos da escolha
  if (escolha.efeito) {
    aplicarEfeitos(escolha.efeito);
  }

  // Salvar consequência
  estadoJogo.escolhasFeitas.push(escolha.consequencia);

  // Verificar se inicia combate
  if (escolha.combate) {
    setTimeout(() => {
      iniciarCombate(escolha.combate);
    }, 2000);
  } else if (escolha.proximoEvento) {
    setTimeout(() => {
      processarEvento(escolha.proximoEvento);
    }, 2000);
  } else {
    setTimeout(continuarHistoria, 2000);
  }

  atualizarInterface();
}

function aplicarEfeitos(efeitos) {
  for (let efeito in efeitos) {
    switch (efeito) {
      case "vida":
        estadoJogo.jogador.vida = Math.min(
          estadoJogo.jogador.vidaMaxima,
          estadoJogo.jogador.vida + efeitos[efeito]
        );
        break;
      case "mana":
        estadoJogo.jogador.mana = Math.min(
          estadoJogo.jogador.manaMaxima,
          estadoJogo.jogador.mana + efeitos[efeito]
        );
        break;
      case "stamina":
        estadoJogo.jogador.stamina = Math.min(
          estadoJogo.jogador.staminaMaxima,
          estadoJogo.jogador.stamina + efeitos[efeito]
        );
        break;
      case "moral":
        estadoJogo.jogador.moral = Math.max(
          0,
          Math.min(100, estadoJogo.jogador.moral + efeitos[efeito])
        );
        break;
      case "moedas":
        estadoJogo.jogador.moedas += efeitos[efeito];
        break;
      case "experiencia":
        estadoJogo.jogador.experiencia += efeitos[efeito];
        break;
      case "reputacao":
        estadoJogo.jogador.reputacao = efeitos[efeito];
        break;
      case "habilidade":
        estadoJogo.jogador.habilidades[efeitos[efeito]] = true;
        break;
    }
  }
}

function executarAtaqueDuplo() {
  estadoJogo.jogador.stamina -= 25;
  cooldowns.ataqueDuplo = 3;

  const multiplicador = estadoJogo.jogador.moral >= 70 ? 1.2 : 1.0;

  // Primeiro ataque
  let dano1 = calcularDano(
    10,
    16,
    estadoJogo.jogador.inventario.armaBonus,
    multiplicador
  );
  if (estadoJogo.inimigoAtual.resistencia === "fisico")
    dano1 = Math.floor(dano1 * 0.7);

  // Segundo ataque
  let dano2 = calcularDano(
    10,
    16,
    estadoJogo.jogador.inventario.armaBonus,
    multiplicador
  );
  if (estadoJogo.inimigoAtual.resistencia === "fisico")
    dano2 = Math.floor(dano2 * 0.7);

  const danoTotal = dano1 + dano2;
  estadoJogo.inimigoAtual.vida = Math.max(
    0,
    estadoJogo.inimigoAtual.vida - danoTotal
  );

  exibirMensagem(
    `⚡ ATAQUE DUPLO! Dois golpes causaram <span class="dano">${dano1}</span> + <span class="dano">${dano2}</span> = <span class="dano">${danoTotal}</span> de dano!`,
    "positivo"
  );

  if (estadoJogo.inimigoAtual.vida <= 0) {
    setTimeout(vitoriaCombate, 1000);
  }

  atualizarInterface();
}

function executarAnalisar() {
  estadoJogo.jogador.mana -= 15;
  cooldowns.analisar = 2;

  const inimigo = estadoJogo.inimigoAtual;
  const proximoMovimento =
    inimigo.padroes[(turnoInimigo + 1) % inimigo.padroes.length];

  estadoJogo.proximoMovimentoRevelado = true;

  let analise = `🔍 ANÁLISE COMPLETA:<br>`;
  analise += `💀 ${inimigo.nome}: ${inimigo.vida}/${inimigo.vidaMaxima} HP<br>`;
  analise += `🎯 Próximo movimento: ${obterDescricaoMovimento(
    proximoMovimento
  )}<br>`;
  analise += `🛡️ Fraqueza: ${inimigo.fraqueza} | Resistência: ${inimigo.resistencia}`;

  exibirMensagem(analise, "positivo");
  atualizarInterface();
}

function obterDescricaoMovimento(movimento) {
  const descricoes = {
    ataque: "🗡️ Ataque básico",
    esquiva: "💨 Preparando esquiva",
    habilidadeEspecial: "⭐ Habilidade especial!",
    furia: "😡 Entrando em fúria",
    magia: "🔮 Conjurando magia",
    invocar: "👻 Invocando aliados",
    drenarVida: "🩸 Preparando drenar vida",
    respirar: "🔥 Preparando sopro de fogo",
    voar: "🦅 Alçando voo",
    intimidar: "😨 Tentando intimidar",
  };
  return descricoes[movimento] || "❓ Movimento desconhecido";
}

function usarPocaoCura() {
  estadoJogo.jogador.inventario.pocoesCura--;
  const cura = calcularDano(40, 60);
  estadoJogo.jogador.vida = Math.min(
    estadoJogo.jogador.vidaMaxima,
    estadoJogo.jogador.vida + cura
  );

  exibirMensagem(
    `🧪 Poção de cura restaurou <span class="cura">${cura}</span> pontos de vida!`,
    "positivo"
  );
  atualizarInterface();
}

function usarPocaoMana() {
  estadoJogo.jogador.inventario.pocoesMana--;
  const restauracao = calcularDano(30, 45);
  estadoJogo.jogador.mana = Math.min(
    estadoJogo.jogador.manaMaxima,
    estadoJogo.jogador.mana + restauracao
  );

  exibirMensagem(
    `💙 Poção de mana restaurou <span class="cura">${restauracao}</span> pontos de mana!`,
    "positivo"
  );
  atualizarInterface();
}

function inimigoEsquiva() {
  const inimigo = estadoJogo.inimigoAtual;
  exibirMensagem(
    `💨 ${inimigo.nome} se preparou para esquivar do próximo ataque!`
  );
  inimigo.esquivaAtiva = true;
}

function inimigoFuria() {
  const inimigo = estadoJogo.inimigoAtual;
  inimigo.dano = inimigo.dano.map((d) => Math.floor(d * 1.5));
  exibirMensagem(
    `😡 ${inimigo.nome} entrou em FÚRIA! Dano aumentado!`,
    "negativo"
  );
}

function inimigoMagia() {
  const inimigo = estadoJogo.inimigoAtual;
  const danoMagico = calcularDano(inimigo.dano[0] + 5, inimigo.dano[1] + 10);

  // Magia ignora armadura física
  const danoFinal = Math.max(1, danoMagico);
  estadoJogo.jogador.vida = Math.max(0, estadoJogo.jogador.vida - danoFinal);

  exibirMensagem(
    `🔮 ${inimigo.nome} lançou um feitiço e causou <span class="dano">${danoFinal}</span> de dano mágico!`,
    "negativo"
  );
  atualizarInterface();
}

function derrotaCombate() {
  estadoJogo.combateAtivo = false;
  estadoJogo.jogador.moral -= 10;

  let mensagem = "💀 Você foi derrotado em combate!<br>";

  // Opções após derrota
  if (estadoJogo.jogador.moedas >= 50) {
    mensagem += `<br><button onclick="pagarResgate()" class="btn-escolha">
            💰 Pagar resgate (50 moedas) - Continuar com 25% vida
        </button>`;
  }

  mensagem += `<br><button onclick="reiniciarJogo()" class="btn-restart">
        🔄 Recomeçar aventura
    </button>`;

  exibirMensagem(mensagem, "negativo");
  document.getElementById("opcoes").innerHTML = "";
}

function pagarResgate() {
  estadoJogo.jogador.moedas -= 50;
  estadoJogo.jogador.vida = Math.floor(estadoJogo.jogador.vidaMaxima * 0.25);
  estadoJogo.jogador.moral -= 5;

  exibirMensagem(
    "💰 Você pagou o resgate e conseguiu escapar... mas sua reputação sofreu.",
    "negativo"
  );

  setTimeout(continuarHistoria, 3000);
}

function subirNivel() {
  estadoJogo.jogador.nivel++;
  estadoJogo.jogador.vidaMaxima += 25;
  estadoJogo.jogador.manaMaxima += 15;
  estadoJogo.jogador.staminaMaxima += 20;
  estadoJogo.jogador.vida = estadoJogo.jogador.vidaMaxima; // Cura completa
  estadoJogo.jogador.mana = estadoJogo.jogador.manaMaxima;
  estadoJogo.jogador.stamina = estadoJogo.jogador.staminaMaxima;
  estadoJogo.jogador.experiencia = 0;

  // Recompensas por nível
  estadoJogo.jogador.inventario.pocoesCura += 1;
  estadoJogo.jogador.inventario.pocoesMana += 1;

  // Novas habilidades em níveis específicos
  if (estadoJogo.jogador.nivel === 3) {
    estadoJogo.jogador.habilidades.bloqueioPerfeito = true;
  }
  if (estadoJogo.jogador.nivel === 5) {
    estadoJogo.jogador.habilidades.curaAvancada = true;
  }
}

function continuarHistoria() {
  // Sistema de progressão de história baseado nas escolhas
  const capitulo = estadoJogo.historia.capitulos[estadoJogo.capitulo - 1];

  if (capitulo && estadoJogo.fase < capitulo.eventos.length) {
    const evento = capitulo.eventos[estadoJogo.fase - 1];
    estadoJogo.escolhaAtual = evento.escolhas;
    exibirHistoriaComEscolhas(evento.texto, evento.escolhas);
  } else {
    // Avançar para próximo capítulo
    estadoJogo.capitulo++;
    estadoJogo.fase = 1;

    if (estadoJogo.capitulo > estadoJogo.historia.capitulos.length) {
      finalizarJogo();
    } else {
      const novoCapitulo =
        estadoJogo.historia.capitulos[estadoJogo.capitulo - 1];
      exibirMensagem(
        `📖 ${novoCapitulo.titulo}<br><br>A jornada continua...`,
        "positivo"
      );
      setTimeout(() => {
        const evento = novoCapitulo.eventos[0];
        estadoJogo.escolhaAtual = evento.escolhas;
        exibirHistoriaComEscolhas(evento.texto, evento.escolhas);
      }, 3000);
    }
  }
}

function finalizarJogo() {
  let final = `🎉 PARABÉNS! Você completou "A Lenda do Reino Perdido"!<br><br>`;
  final += `⭐ Nível Final: ${estadoJogo.jogador.nivel}<br>`;
  final += `😊 Moral Final: ${estadoJogo.jogador.moral}<br>`;
  final += `👑 Reputação: ${estadoJogo.jogador.reputacao}<br><br>`;

  // Final baseado nas escolhas
  const escolhasHeroicas = estadoJogo.escolhasFeitas.filter(
    (e) => e === "guerreiro" || e === "heroico"
  ).length;
  const escolhasMagicas = estadoJogo.escolhasFeitas.filter(
    (e) => e === "mago"
  ).length;

  if (escolhasHeroicas > escolhasMagicas) {
    final += `🗡️ Você se tornou uma lenda como o maior guerreiro de Eldoria!`;
  } else if (escolhasMagicas > escolhasHeroicas) {
    final += `🔮 Você se tornou o Arquimago mais poderoso do reino!`;
  } else {
    final += `⚖️ Você encontrou o equilíbrio perfeito entre força e sabedoria!`;
  }

  final += `<br><br><button onclick="reiniciarJogo()" class="btn-restart">🎮 Jogar Novamente</button>`;

  exibirMensagem(final, "positivo");
}

function atualizarStatusEfeitos() {
  const statusContainer = document.getElementById("statusEfeitos");
  if (!statusContainer) return;

  let statusHTML = "";
  const efeitos = estadoJogo.jogador.statusEfeitos;

  if (efeitos.envenenado > 0) {
    statusHTML += `<span class="status-negativo">🐍 Envenenado (${efeitos.envenenado})</span> `;
  }
  if (efeitos.regeneracao > 0) {
    statusHTML += `<span class="status-positivo">✨ Regeneração (${efeitos.regeneracao})</span> `;
  }
  if (efeitos.defesaAumentada > 0) {
    statusHTML += `<span class="status-positivo">🛡️ Defesa+ (${efeitos.defesaAumentada})</span> `;
  }
  if (efeitos.fury > 0) {
    statusHTML += `<span class="status-positivo">😡 Fúria (${efeitos.fury})</span> `;
  }

  statusContainer.innerHTML = statusHTML;
}

function reiniciarJogo() {
  // Reset completo do estado do jogo
  estadoJogo.jogador = {
    nome: "Herói",
    vida: 100,
    vidaMaxima: 100,
    mana: 50,
    manaMaxima: 50,
    stamina: 100,
    staminaMaxima: 100,
    nivel: 1,
    experiencia: 0,
    moedas: 50,
    moral: 50,
    reputacao: "Desconhecido",
    inventario: {
      pocoesCura: 2,
      pocoesMana: 2,
      armaduraBonus: 0,
      armaBonus: 0,
      pergaminhos: 0,
    },
    habilidades: {
      ataqueDuplo: false,
      curaAvancada: false,
      bloqueioPerfeito: false,
      analisarInimigo: false,
    },
    statusEfeitos: {
      envenenado: 0,
      regeneracao: 0,
      fury: 0,
      defesaAumentada: 0,
    },
  };

  estadoJogo.inimigoAtual = null;
  estadoJogo.combateAtivo = false;
  estadoJogo.fase = 1;
  estadoJogo.capitulo = 1;
  estadoJogo.escolhasFeitas = [];
  estadoJogo.escolhaAtual = null;

  // Reset cooldowns
  for (let habilidade in cooldowns) {
    cooldowns[habilidade] = 0;
  }

  atualizarInterface();
  setTimeout(iniciarJogo, 1000);
}

// Sistema de combate estratégico
function iniciarCombate(tipoInimigo) {
  const inimigo = { ...estadoJogo.inimigos[tipoInimigo] };
  inimigo.vida = inimigo.vidaMaxima;
  estadoJogo.inimigoAtual = inimigo;
  estadoJogo.combateAtivo = true;
  turnoInimigo = 0;

  exibirMensagem(`⚔️ Combate iniciado contra ${inimigo.nome}!<br>
                   <em>${inimigo.descricao}</em><br>
                   💡 Fraqueza: ${inimigo.fraqueza} | Resistência: ${inimigo.resistencia}`);

  setTimeout(mostrarOpcoesCombate, 2000);
}

function mostrarOpcoesCombate() {
  if (!estadoJogo.combateAtivo) return;

  const opcoesCombate = [
    {
      texto: "⚔️ Ataque Básico",
      acao: "ataqueBasico",
      custo: { tipo: "stamina", valor: 10 },
      descricao: "Ataque simples mas confiável",
    },
    {
      texto: "🛡️ Defender",
      acao: "defender",
      custo: { tipo: "stamina", valor: 5 },
      descricao: "Reduz dano e recupera stamina",
    },
  ];

  // Habilidades especiais baseadas na classe
  if (
    estadoJogo.jogador.habilidades.ataqueDuplo &&
    cooldowns.ataqueDuplo === 0
  ) {
    opcoesCombate.push({
      texto: "⚡ Ataque Duplo",
      acao: "ataqueDuplo",
      custo: { tipo: "stamina", valor: 25 },
      descricao: "Dois ataques seguidos (Cooldown: 3 turnos)",
    });
  }

  if (
    estadoJogo.jogador.habilidades.analisarInimigo &&
    cooldowns.analisar === 0
  ) {
    opcoesCombate.push({
      texto: "🔍 Analisar Inimigo",
      acao: "analisar",
      custo: { tipo: "mana", valor: 15 },
      descricao: "Revela próximo movimento (Cooldown: 2 turnos)",
    });
  }

  if (estadoJogo.jogador.inventario.pocoesCura > 0) {
    opcoesCombate.push({
      texto: `🧪 Poção de Cura (${estadoJogo.jogador.inventario.pocoesCura})`,
      acao: "pocaoCura",
      descricao: "Restaura 40-60 de vida",
    });
  }

  if (estadoJogo.jogador.inventario.pocoesMana > 0) {
    opcoesCombate.push({
      texto: `💙 Poção de Mana (${estadoJogo.jogador.inventario.pocoesMana})`,
      acao: "pocaoMana",
      descricao: "Restaura 30-45 de mana",
    });
  }

  exibirOpcoesCombate(opcoesCombate);
}

function exibirOpcoesCombate(opcoes) {
  let opcoesHTML = "";
  opcoes.forEach((opcao, index) => {
    const disponivel = verificarDisponibilidade(opcao.custo);
    const classeBtn = disponivel ? "btn-combate" : "btn-indisponivel";
    const custoTexto = opcao.custo
      ? ` (-${opcao.custo.valor} ${opcao.custo.tipo})`
      : "";

    opcoesHTML += `<button onclick="executarAcaoCombate('${opcao.acao}')" 
                       class="${classeBtn}" ${!disponivel ? "disabled" : ""}
                       title="${opcao.descricao}">
            ${opcao.texto}${custoTexto}
        </button>`;
  });
  document.getElementById("opcoes").innerHTML = opcoesHTML;
}

function executarAcaoCombate(acao) {
  switch (acao) {
    case "ataqueBasico":
      executarAtaqueBasico();
      break;
    case "defender":
      executarDefender();
      break;
    case "ataqueDuplo":
      executarAtaqueDuplo();
      break;
    case "analisar":
      executarAnalisar();
      break;
    case "pocaoCura":
      usarPocaoCura();
      break;
    case "pocaoMana":
      usarPocaoMana();
      break;
  }

  processarStatusEfeitos();
  reduzirCooldowns();

  setTimeout(() => {
    if (estadoJogo.combateAtivo && estadoJogo.inimigoAtual.vida > 0) {
      turnoInimigo++;
      executarTurnoInimigo();
    }
  }, 1500);
}

function executarAtaqueBasico() {
  estadoJogo.jogador.stamina -= 10;

  const multiplicador =
    estadoJogo.jogador.moral >= 70
      ? 1.2
      : estadoJogo.jogador.moral <= 30
      ? 0.8
      : 1.0;

  const dano = calcularDano(
    12,
    20,
    estadoJogo.jogador.inventario.armaBonus,
    multiplicador
  );

  // Verificar resistência do inimigo
  const danoFinal =
    estadoJogo.inimigoAtual.resistencia === "fisico"
      ? Math.floor(dano * 0.7)
      : dano;

  estadoJogo.inimigoAtual.vida = Math.max(
    0,
    estadoJogo.inimigoAtual.vida - danoFinal
  );

  exibirMensagem(
    `⚔️ Você atacou e causou <span class="dano">${danoFinal}</span> de dano!`
  );

  if (estadoJogo.inimigoAtual.vida <= 0) {
    setTimeout(vitoriaCombate, 1000);
  }

  atualizarInterface();
}

function executarDefender() {
  estadoJogo.jogador.stamina -= 5;
  const cura = calcularDano(5, 12);
  const staminaRecuperada = 15;

  estadoJogo.jogador.vida = Math.min(
    estadoJogo.jogador.vidaMaxima,
    estadoJogo.jogador.vida + cura
  );
  estadoJogo.jogador.stamina = Math.min(
    estadoJogo.jogador.staminaMaxima,
    estadoJogo.jogador.stamina + staminaRecuperada
  );

  aplicarStatusEfeito("defesaAumentada", 2);

  exibirMensagem(
    `🛡️ Você se defendeu! Recuperou <span class="cura">${cura}</span> vida e ${staminaRecuperada} stamina. Defesa aumentada por 2 turnos!`,
    "positivo"
  );

  atualizarInterface();
}

function executarTurnoInimigo() {
  const inimigo = estadoJogo.inimigoAtual;
  const padraoAtual = inimigo.padroes[turnoInimigo % inimigo.padroes.length];

  // Mostrar próximo movimento se o jogador usou analisar
  if (estadoJogo.proximoMovimentoRevelado) {
    exibirMensagem(
      `🔮 Próximo movimento previsto: ${obterDescricaoMovimento(padraoAtual)}`,
      "positivo"
    );
    estadoJogo.proximoMovimentoRevelado = false;

    setTimeout(() => executarMovimentoInimigo(padraoAtual), 2000);
  } else {
    executarMovimentoInimigo(padraoAtual);
  }
}

function executarMovimentoInimigo(movimento) {
  const inimigo = estadoJogo.inimigoAtual;

  switch (movimento) {
    case "ataque":
      inimigoAtaque();
      break;
    case "esquiva":
      inimigoEsquiva();
      break;
    case "habilidadeEspecial":
      inimigoHabilidadeEspecial();
      break;
    case "furia":
      inimigoFuria();
      break;
    case "magia":
      inimigoMagia();
      break;
  }

  setTimeout(verificarEstadoCombate, 1500);
}

function inimigoAtaque() {
  const inimigo = estadoJogo.inimigoAtual;
  const danoBase = calcularDano(inimigo.dano[0], inimigo.dano[1]);
  const defesaJogador =
    estadoJogo.jogador.statusEfeitos.defesaAumentada > 0
      ? estadoJogo.jogador.inventario.armaduraBonus + 5
      : estadoJogo.jogador.inventario.armaduraBonus;

  const danoFinal = Math.max(1, danoBase - defesaJogador);

  estadoJogo.jogador.vida = Math.max(0, estadoJogo.jogador.vida - danoFinal);

  exibirMensagem(
    `💀 ${inimigo.nome} atacou e causou <span class="dano">${danoFinal}</span> de dano!`
  );

  atualizarInterface();
}

function inimigoHabilidadeEspecial() {
  const inimigo = estadoJogo.inimigoAtual;

  switch (inimigo.habilidadeEspecial) {
    case "veneno":
      aplicarStatusEfeito("envenenado", 3);
      exibirMensagem(
        `🐍 ${inimigo.nome} aplicou veneno! Você sofrerá dano por 3 turnos!`,
        "negativo"
      );
      break;
    case "drenarVida":
      const drenagem = 15;
      estadoJogo.jogador.vida = Math.max(0, estadoJogo.jogador.vida - drenagem);
      inimigo.vida = Math.min(inimigo.vidaMaxima, inimigo.vida + drenagem);
      exibirMensagem(
        `🩸 ${inimigo.nome} drenou ${drenagem} de sua vida!`,
        "negativo"
      );
      break;
  }

  atualizarInterface();
}

function verificarEstadoCombate() {
  if (estadoJogo.jogador.vida <= 0) {
    derrotaCombate();
  } else if (estadoJogo.inimigoAtual.vida <= 0) {
    vitoriaCombate();
  } else {
    mostrarOpcoesCombate();
  }
}

function vitoriaCombate() {
  const inimigo = estadoJogo.inimigoAtual;
  estadoJogo.combateAtivo = false;

  estadoJogo.jogador.experiencia += inimigo.experiencia;
  estadoJogo.jogador.moedas += inimigo.moedas;
  estadoJogo.jogador.moral += 5;

  // Sistema de drop
  let drops = [];
  for (let item in inimigo.dropChance) {
    if (Math.random() < inimigo.dropChance[item]) {
      drops.push(item);
      // Aplicar drop
      switch (item) {
        case "pocao":
          estadoJogo.jogador.inventario.pocoesCura++;
          break;
        case "pergaminho":
          estadoJogo.jogador.inventario.pergaminhos++;
          break;
        case "mana":
          estadoJogo.jogador.inventario.pocoesMana++;
          break;
      }
    }
  }

  let mensagem = `🏆 Vitória! ${inimigo.nome} foi derrotado!<br>`;
  mensagem += `💰 +${inimigo.moedas} moedas | ✨ +${inimigo.experiencia} XP | 😊 +5 Moral`;

  if (drops.length > 0) {
    mensagem += `<br>🎁 Items encontrados: ${drops.join(", ")}`;
  }

  // Verificar subida de nível
  const expNecessaria = estadoJogo.jogador.nivel * 100;
  if (estadoJogo.jogador.experiencia >= expNecessaria) {
    subirNivel();
    mensagem += `<br>⭐ SUBIU DE NÍVEL! Agora você é nível ${estadoJogo.jogador.nivel}!`;
  }

  exibirMensagem(mensagem, "positivo");

  setTimeout(() => {
    continuarHistoria();
  }, 4000);
}

function atualizarInterface() {
  // Atualizar todos os elementos da interface
  document.getElementById("vidaJogador").textContent = estadoJogo.jogador.vida;

  // Verificar se elementos existem antes de atualizar
  const elemVidaMax = document.getElementById("vidaMaxima");
  if (elemVidaMax) elemVidaMax.textContent = estadoJogo.jogador.vidaMaxima;

  const elemMana = document.getElementById("manaJogador");
  if (elemMana) elemMana.textContent = estadoJogo.jogador.mana;

  const elemManaMax = document.getElementById("manaMaxima");
  if (elemManaMax) elemManaMax.textContent = estadoJogo.jogador.manaMaxima;

  const elemStamina = document.getElementById("staminaJogador");
  if (elemStamina) elemStamina.textContent = estadoJogo.jogador.stamina;

  const elemStaminaMax = document.getElementById("staminaMaxima");
  if (elemStaminaMax)
    elemStaminaMax.textContent = estadoJogo.jogador.staminaMaxima;

  document.getElementById("nivel").textContent = estadoJogo.jogador.nivel;
  document.getElementById("experiencia").textContent =
    estadoJogo.jogador.experiencia;
  document.getElementById("moedas").textContent = estadoJogo.jogador.moedas;

  const elemMoral = document.getElementById("moral");
  if (elemMoral) elemMoral.textContent = estadoJogo.jogador.moral;

  const elemPocoes = document.getElementById("pocoes");
  if (elemPocoes)
    elemPocoes.textContent = estadoJogo.jogador.inventario.pocoesCura;

  const elemPocoesMana = document.getElementById("pocoesMana");
  if (elemPocoesMana)
    elemPocoesMana.textContent = estadoJogo.jogador.inventario.pocoesMana;

  const elemPergaminhos = document.getElementById("pergaminhos");
  if (elemPergaminhos)
    elemPergaminhos.textContent = estadoJogo.jogador.inventario.pergaminhos;

  document.getElementById("fase").textContent = estadoJogo.fase;

  const elemCapitulo = document.getElementById("capitulo");
  if (elemCapitulo) elemCapitulo.textContent = estadoJogo.capitulo;

  const elemReputacao = document.getElementById("reputacao");
  if (elemReputacao) elemReputacao.textContent = estadoJogo.jogador.reputacao;

  // Atualizar barras de progresso
  atualizarBarra(
    "barraVidaJogador",
    estadoJogo.jogador.vida,
    estadoJogo.jogador.vidaMaxima
  );
  atualizarBarra(
    "barraManaJogador",
    estadoJogo.jogador.mana,
    estadoJogo.jogador.manaMaxima
  );
  atualizarBarra(
    "barraStaminaJogador",
    estadoJogo.jogador.stamina,
    estadoJogo.jogador.staminaMaxima
  );

  // Atualizar seção de combate
  const combatSection = document.getElementById("combatSection");
  if (combatSection) {
    if (estadoJogo.combateAtivo && estadoJogo.inimigoAtual) {
      combatSection.style.display = "block";
      document.getElementById("vidaInimigo").textContent =
        estadoJogo.inimigoAtual.vida;
      document.getElementById("nomeInimigo").textContent =
        estadoJogo.inimigoAtual.nome;
      atualizarBarra(
        "barraVidaInimigo",
        estadoJogo.inimigoAtual.vida,
        estadoJogo.inimigoAtual.vidaMaxima
      );
    } else {
      combatSection.style.display = "none";
    }
  }

  // Atualizar elementos específicos se existirem
  if (estadoJogo.inimigoAtual) {
    const elemVidaInimigo = document.getElementById("vidaInimigo");
    if (elemVidaInimigo)
      elemVidaInimigo.textContent = estadoJogo.inimigoAtual.vida;

    const elemNomeInimigo = document.getElementById("nomeInimigo");
    if (elemNomeInimigo)
      elemNomeInimigo.textContent = estadoJogo.inimigoAtual.nome;

    atualizarBarra(
      "barraVidaInimigo",
      estadoJogo.inimigoAtual.vida,
      estadoJogo.inimigoAtual.vidaMaxima
    );
  }

  // Atualizar habilidades desbloqueadas
  atualizarHabilidades();

  // Atualizar status effects
  atualizarStatusEfeitos();

  // Atualizar cooldowns
  atualizarCooldowns();
}

function atualizarHabilidades() {
  const habilidadesList = document.getElementById("habilidadesList");
  if (!habilidadesList) return;

  let habilidadesHTML = "";
  const habilidades = [
    { key: "ataqueDuplo", nome: "🗡️ Ataque Duplo" },
    { key: "analisarInimigo", nome: "🔍 Analisar Inimigo" },
    { key: "bloqueioPerfeito", nome: "🛡️ Bloqueio Perfeito" },
    { key: "curaAvancada", nome: "💚 Cura Avançada" },
  ];

  habilidades.forEach((habilidade) => {
    const desbloqueada = estadoJogo.jogador.habilidades[habilidade.key];
    const classe = desbloqueada
      ? "ability-item unlocked"
      : "ability-item locked";
    habilidadesHTML += `<div class="${classe}">${habilidade.nome}</div>`;
  });

  habilidadesList.innerHTML = habilidadesHTML;
}

function atualizarCooldowns() {
  const cooldownsList = document.getElementById("cooldownsList");
  if (!cooldownsList) return;

  let cooldownsHTML = "";
  for (let habilidade in cooldowns) {
    if (cooldowns[habilidade] > 0) {
      const nomes = {
        ataqueDuplo: "⚡ Ataque Duplo",
        analisar: "🔍 Analisar",
        curaAvancada: "💚 Cura Avançada",
        bloqueio: "🛡️ Bloqueio",
      };
      cooldownsHTML += `<div class="cooldown-item">
                <span>${nomes[habilidade] || habilidade}</span>
                <span>${cooldowns[habilidade]} turnos</span>
            </div>`;
    }
  }

  cooldownsList.innerHTML =
    cooldownsHTML ||
    '<div style="color: #888; font-style: italic;">Nenhuma habilidade em cooldown</div>';
}

function atualizarBarra(elementId, valorAtual, valorMaximo) {
  const porcentagem = (valorAtual / valorMaximo) * 100;
  document.getElementById(elementId).style.width = porcentagem + "%";
}

function iniciarJogo() {
  exibirHistoriaComEscolhas(
    estadoJogo.historia.prologo.texto,
    estadoJogo.historia.prologo.escolhas
  );
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎮 Jogo carregado! Estado inicial:", estadoJogo);
  atualizarInterface();
  setTimeout(iniciarJogo, 1000);
});
