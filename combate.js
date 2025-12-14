// ========================================
// SISTEMA DE COMBATE ESTRATÉGICO
// ========================================

class SistemaCombate {
  constructor() {
    this.turnoAtual = 0;
    this.combateAtivo = false;
    this.inimigosVivos = [];
    this.efeitos = new Map(); // Buffs/debuffs ativos
    this.historico = [];
    this.cooldowns = new Map(); // Cooldowns de habilidades
  }

  // Iniciar novo combate
  iniciarCombate(jogador, inimigos) {
    this.combateAtivo = true;
    this.turnoAtual = 1;
    this.inimigosVivos = [...inimigos];
    this.efeitos.clear();
    this.cooldowns.clear();
    this.historico = [];

    this.adicionarLog(`🎯 COMBATE INICIADO! Turno ${this.turnoAtual}`);
    this.adicionarLog(
      `⚔️ ${jogador.nome} vs ${inimigos.map((i) => i.nome).join(", ")}`
    );

    // Atualizar interface
    this.atualizarInterface(jogador);
    this.calcularOrdemTurnos(jogador);

    return true;
  }

  // Calcular ordem dos turnos baseado na agilidade
  calcularOrdemTurnos(jogador) {
    const participantes = [jogador, ...this.inimigosVivos];
    participantes.sort((a, b) => {
      const agilidadeA = a.atributos?.agilidade || a.agilidade;
      const agilidadeB = b.atributos?.agilidade || b.agilidade;
      return agilidadeB - agilidadeA;
    });

    const ordem = participantes.map((p) => p.nome).join(" → ");
    this.adicionarLog(`📋 Ordem dos turnos: ${ordem}`);

    return participantes;
  }

  // Executar ataque do jogador
  executarAtaqueJogador(jogador, habilidade, alvoIndex = 0) {
    if (!this.combateAtivo) return false;

    const alvo = this.inimigosVivos[alvoIndex];
    if (!alvo) {
      this.adicionarLog("❌ Alvo inválido!");
      return false;
    }

    // Verificar cooldown
    const cooldownKey = `jogador_${habilidade.nome}`;
    if (this.cooldowns.has(cooldownKey)) {
      const turnosRestantes = this.cooldowns.get(cooldownKey);
      this.adicionarLog(
        `⏳ ${habilidade.nome} está em cooldown por ${turnosRestantes} turnos`
      );
      return false;
    }

    // Verificar recursos
    if (!this.verificarRecursos(jogador, habilidade.custo)) {
      this.adicionarLog("❌ Recursos insuficientes!");
      return false;
    }

    // Consumir recursos
    this.consumirRecursos(jogador, habilidade.custo);

    // Aplicar cooldown
    if (habilidade.cooldown) {
      this.cooldowns.set(cooldownKey, habilidade.cooldown);
    }

    // Executar habilidade
    let resultado;
    if (habilidade.dano) {
      resultado = this.aplicarDano(jogador, alvo, habilidade);
    } else if (habilidade.efeito) {
      resultado = this.aplicarEfeito(jogador, alvo, habilidade);
    }

    this.adicionarLog(`⚔️ ${jogador.nome} usa ${habilidade.nome}!`);

    // Verificar se inimigo foi derrotado
    if (alvo.vida <= 0) {
      this.derrotarInimigo(alvoIndex, jogador);
    }

    return true;
  }

  // Aplicar dano com cálculos estratégicos
  aplicarDano(atacante, defensor, habilidade) {
    const baseDano = this.calcularDanoBase(habilidade.dano);
    const multiplicadorAtaque = this.calcularMultiplicadorAtaque(atacante);
    const reducaoDefesa = this.calcularReducaoDefesa(defensor, habilidade.dano);

    // Calcular dano crítico (arqueiros têm passiva)
    let multiplicadorCritico = 1;
    if (atacante.classe === "arqueiro" && Math.random() < 0.15) {
      multiplicadorCritico = 2;
      this.adicionarLog("💥 CRÍTICO!");
    }

    const danoFinal = Math.max(
      1,
      Math.floor(
        baseDano * multiplicadorAtaque * reducaoDefesa * multiplicadorCritico
      )
    );

    defensor.vida -= danoFinal;

    const tipoSimbolo = habilidade.dano.fisico ? "⚔️" : "🔮";
    this.adicionarLog(
      `${tipoSimbolo} ${danoFinal} de dano em ${defensor.nome} (${defensor.vida} HP restante)`
    );

    return danoFinal;
  }

  // Calcular dano base da habilidade
  calcularDanoBase(dano) {
    if (dano.fisico) {
      const [min, max] = dano.fisico;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else if (dano.magico) {
      const [min, max] = dano.magico;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return 0;
  }

  // Multiplicador baseado nos atributos do atacante
  calcularMultiplicadorAtaque(atacante) {
    const forca = atacante.atributos.forca || 10;
    const inteligencia = atacante.atributos.inteligencia || 10;

    // Guerreiros usam força, magos inteligência
    const atributoRelevante = atacante.classe === "mago" ? inteligencia : forca;
    return 1 + (atributoRelevante - 10) * 0.05; // 5% por ponto acima de 10
  }

  // Redução baseada na defesa
  calcularReducaoDefesa(defensor, tipoDano) {
    let defesa = 0;

    if (tipoDano.fisico) {
      defesa = defensor.atributos?.defesaFisica || defensor.defesaFisica || 0;
    } else if (tipoDano.magico) {
      defesa = defensor.atributos?.defesaMagica || defensor.defesaMagica || 0;
    }

    // Resistências específicas do inimigo
    if (defensor.resistencias) {
      const resistencia = tipoDano.fisico
        ? defensor.resistencias.fisico
        : defensor.resistencias.magico;
      defesa += resistencia / 100;
    }

    return Math.max(0.1, 1 - defesa * 0.05); // Mínimo 10% do dano
  }

  // Turno dos inimigos com IA
  executarTurnoInimigos(jogador) {
    for (const inimigo of this.inimigosVivos) {
      if (inimigo.vida <= 0) continue;

      this.executarIAInimigo(inimigo, jogador);

      // Verificar se jogador foi derrotado
      if (jogador.vida <= 0) {
        this.finalizarCombate(false, jogador);
        return;
      }
    }

    this.proximoTurno(jogador);
  }

  // Inteligência artificial dos inimigos
  executarIAInimigo(inimigo, jogador) {
    const estrategia = inimigo.ia || "agressivo";
    let ataqueEscolhido;

    switch (estrategia) {
      case "agressivo":
        // Sempre o ataque com maior dano
        ataqueEscolhido = inimigo.ataques.reduce((melhor, atual) => {
          const danoAtual = atual.dano ? Math.max(...atual.dano) : 0;
          const danoMelhor = melhor.dano ? Math.max(...melhor.dano) : 0;
          return danoAtual > danoMelhor ? atual : melhor;
        });
        break;

      case "defensivo":
        // Prioriza efeitos defensivos se vida baixa
        if (inimigo.vida < inimigo.vidaMaxima * 0.3) {
          ataqueEscolhido =
            inimigo.ataques.find((a) => a.efeito) || inimigo.ataques[0];
        } else {
          ataqueEscolhido = this.escolherAtaqueAleatorio(inimigo);
        }
        break;

      case "tatico":
        // Escolha baseada na situação
        ataqueEscolhido = this.escolhaIATatica(inimigo, jogador);
        break;

      default:
        ataqueEscolhido = this.escolherAtaqueAleatorio(inimigo);
    }

    this.executarAtaqueInimigo(inimigo, jogador, ataqueEscolhido);
  }

  // Escolha aleatória ponderada por chance
  escolherAtaqueAleatorio(inimigo) {
    const random = Math.random() * 100;
    let chanceAcumulada = 0;

    for (const ataque of inimigo.ataques) {
      chanceAcumulada += ataque.chance;
      if (random <= chanceAcumulada) {
        return ataque;
      }
    }

    return inimigo.ataques[0]; // Fallback
  }

  // IA tática avançada
  escolhaIATatica(inimigo, jogador) {
    // Se jogador tem pouca vida, atacar agressivamente
    if (jogador.vida < jogador.vidaMaxima * 0.25) {
      return inimigo.ataques.reduce((melhor, atual) => {
        const danoAtual = atual.dano ? Math.max(...atual.dano) : 0;
        const danoMelhor = melhor.dano ? Math.max(...melhor.dano) : 0;
        return danoAtual > danoMelhor ? atual : melhor;
      });
    }

    // Se inimigo tem pouca vida, tentar efeitos especiais
    if (inimigo.vida < inimigo.vidaMaxima * 0.4) {
      const ataqueComEfeito = inimigo.ataques.find((a) => a.efeito);
      if (ataqueComEfeito) return ataqueComEfeito;
    }

    return this.escolherAtaqueAleatorio(inimigo);
  }

  // Executar ataque do inimigo
  executarAtaqueInimigo(inimigo, jogador, ataque) {
    this.adicionarLog(`👹 ${inimigo.nome} usa ${ataque.nome}!`);

    if (ataque.dano) {
      const dano = this.calcularDanoInimigo(inimigo, jogador, ataque);
      jogador.vida -= dano;
      this.adicionarLog(
        `💔 Você recebe ${dano} de dano (${jogador.vida} HP restante)`
      );
    }

    if (ataque.efeito) {
      this.aplicarEfeitoInimigo(ataque.efeito, jogador);
    }
  }

  // Próximo turno
  proximoTurno(jogador) {
    this.turnoAtual++;

    // Reduzir cooldowns
    for (const [key, turnos] of this.cooldowns.entries()) {
      if (turnos <= 1) {
        this.cooldowns.delete(key);
      } else {
        this.cooldowns.set(key, turnos - 1);
      }
    }

    // Aplicar passivas
    this.aplicarPassivas(jogador);

    // Verificar condições de vitória
    if (this.inimigosVivos.filter((i) => i.vida > 0).length === 0) {
      this.finalizarCombate(true, jogador);
      return;
    }

    this.adicionarLog(`\n🔄 TURNO ${this.turnoAtual}`);
    this.atualizarInterface(jogador);
  }

  // Aplicar habilidades passivas
  aplicarPassivas(jogador) {
    switch (jogador.classe) {
      case "guerreiro":
        // Regeneração de 2 HP por turno
        if (jogador.vida < jogador.vidaMaxima) {
          jogador.vida = Math.min(jogador.vidaMaxima, jogador.vida + 2);
          this.adicionarLog("💚 Regeneração: +2 HP");
        }
        break;

      case "mago":
        // Regeneração de 3 MP por turno
        if (jogador.mana < jogador.manaMaxima) {
          jogador.mana = Math.min(jogador.manaMaxima, jogador.mana + 3);
          this.adicionarLog("💙 Regeneração: +3 MP");
        }
        break;
    }
  }

  // Finalizar combate
  finalizarCombate(vitoria, jogador) {
    this.combateAtivo = false;

    if (vitoria) {
      this.adicionarLog("🎉 VITÓRIA!");

      // Calcular recompensas
      let expTotal = 0;
      let ouroTotal = 0;
      let itemsGanhos = [];

      for (const inimigo of this.inimigosVivos) {
        if (inimigo.drops) {
          expTotal += inimigo.drops.experiencia || 0;
          ouroTotal += inimigo.drops.moedas || 0;
          if (inimigo.drops.items) {
            itemsGanhos.push(...inimigo.drops.items);
          }
        }
      }

      // Aplicar recompensas
      jogador.experiencia += expTotal;
      jogador.ouro += ouroTotal;

      this.adicionarLog(`💰 +${expTotal} EXP, +${ouroTotal} ouro`);
      if (itemsGanhos.length > 0) {
        this.adicionarLog(`🎁 Items: ${itemsGanhos.join(", ")}`);
      }

      // Verificar level up
      this.verificarLevelUp(jogador);
    } else {
      this.adicionarLog("💀 DERROTA!");
      this.adicionarLog("Você foi derrotado... Tente novamente!");
    }

    this.atualizarInterface(jogador);

    // Mostrar botão de continuar
    setTimeout(() => {
      document.getElementById("combate-acoes").innerHTML = `
                <button onclick="voltarMapa()" class="btn-principal">
                    ${vitoria ? "🗺️ Voltar ao Mapa" : "🔄 Tentar Novamente"}
                </button>
            `;
    }, 2000);
  }

  // Verificar e aplicar level up
  verificarLevelUp(jogador) {
    const expNecessaria = jogador.nivel * 100;
    if (jogador.experiencia >= expNecessaria) {
      jogador.nivel++;
      jogador.experiencia -= expNecessaria;

      // Aumentar atributos
      jogador.vidaMaxima += 10;
      jogador.manaMaxima += 5;
      jogador.staminaMaxima += 5;
      jogador.vida = jogador.vidaMaxima; // Cura completa
      jogador.mana = jogador.manaMaxima;
      jogador.stamina = jogador.staminaMaxima;

      this.adicionarLog(`🌟 LEVEL UP! Agora você é nível ${jogador.nivel}!`);
      this.adicionarLog("💚 Vida, mana e stamina restauradas!");
    }
  }

  // Utilitários
  verificarRecursos(jogador, custo) {
    if (custo.vida && jogador.vida <= custo.vida) return false;
    if (custo.mana && jogador.mana < custo.mana) return false;
    if (custo.stamina && jogador.stamina < custo.stamina) return false;
    return true;
  }

  consumirRecursos(jogador, custo) {
    if (custo.vida) jogador.vida -= custo.vida;
    if (custo.mana) jogador.mana -= custo.mana;
    if (custo.stamina) jogador.stamina -= custo.stamina;
  }

  derrotarInimigo(index, jogador) {
    const inimigo = this.inimigosVivos[index];
    this.adicionarLog(`💀 ${inimigo.nome} foi derrotado!`);
    inimigo.vida = 0;
  }

  calcularDanoInimigo(inimigo, jogador, ataque) {
    const [min, max] = ataque.dano;
    const danoBase = Math.floor(Math.random() * (max - min + 1)) + min;

    // Aplicar defesa do jogador
    const defesa =
      ataque.tipo === "fisico"
        ? jogador.atributos.defesaFisica
        : jogador.atributos.defesaMagica;
    const reducao = Math.max(0.1, 1 - defesa * 0.03);

    return Math.max(1, Math.floor(danoBase * reducao));
  }

  aplicarEfeitoInimigo(efeito, jogador) {
    switch (efeito) {
      case "envenenado":
        this.adicionarLog("🟢 Você foi envenenado!");
        // Implementar sistema de envenenamento
        break;
      case "atordoar":
        this.adicionarLog("💫 Você foi atordoado!");
        break;
    }
  }

  adicionarLog(mensagem) {
    this.historico.push(mensagem);
    const logElement = document.getElementById("combate-log");
    if (logElement) {
      logElement.innerHTML += mensagem + "<br>";
      logElement.scrollTop = logElement.scrollHeight;
    }
    console.log(mensagem);
  }

  atualizarInterface(jogador) {
    // Atualizar barras de recursos
    this.atualizarBarras(jogador);

    // Atualizar lista de inimigos
    this.atualizarListaInimigos();

    // Atualizar habilidades disponíveis
    this.atualizarHabilidades(jogador);
  }

  atualizarBarras(jogador) {
    const vidaPorcentagem = (jogador.vida / jogador.vidaMaxima) * 100;
    const manaPorcentagem = (jogador.mana / jogador.manaMaxima) * 100;
    const staminaPorcentagem = (jogador.stamina / jogador.staminaMaxima) * 100;

    document.getElementById("barra-vida").style.width = `${vidaPorcentagem}%`;
    document.getElementById("barra-mana").style.width = `${manaPorcentagem}%`;
    document.getElementById(
      "barra-stamina"
    ).style.width = `${staminaPorcentagem}%`;

    document.getElementById(
      "vida-texto"
    ).textContent = `${jogador.vida}/${jogador.vidaMaxima}`;
    document.getElementById(
      "mana-texto"
    ).textContent = `${jogador.mana}/${jogador.manaMaxima}`;
    document.getElementById(
      "stamina-texto"
    ).textContent = `${jogador.stamina}/${jogador.staminaMaxima}`;
  }

  atualizarListaInimigos() {
    const container = document.getElementById("inimigos-lista");
    if (!container) return;

    container.innerHTML = this.inimigosVivos
      .map((inimigo, index) => {
        const vidaPorcentagem = Math.max(
          0,
          (inimigo.vida / inimigo.vidaMaxima) * 100
        );
        const statusVida =
          inimigo.vida <= 0
            ? "morto"
            : vidaPorcentagem < 30
            ? "critico"
            : vidaPorcentagem < 60
            ? "ferido"
            : "saudavel";

        return `
                    <div class="inimigo-card ${statusVida}" data-index="${index}">
                        <div class="inimigo-info">
                            <h4>${inimigo.nome}</h4>
                            <div class="vida-inimigo">
                                <div class="barra-vida-inimigo">
                                    <div class="preenchimento-vida" style="width: ${vidaPorcentagem}%"></div>
                                </div>
                                <span>${Math.max(0, inimigo.vida)}/${
          inimigo.vidaMaxima || inimigo.vida
        }</span>
                            </div>
                        </div>
                        ${
                          inimigo.vida > 0
                            ? `<button onclick="selecionarAlvo(${index})" class="btn-alvo">🎯</button>`
                            : ""
                        }
                    </div>
                `;
      })
      .join("");
  }

  atualizarHabilidades(jogador) {
    const container = document.getElementById("habilidades-lista");
    if (!container) return;

    const classeData = CLASSES[jogador.classe];
    if (!classeData) return;

    container.innerHTML = classeData.habilidades
      .map((habilidade, index) => {
        const cooldownKey = `jogador_${habilidade.nome}`;
        const emCooldown = this.cooldowns.has(cooldownKey);
        const temRecursos = this.verificarRecursos(jogador, habilidade.custo);

        const cooldownTexto = emCooldown
          ? ` (${this.cooldowns.get(cooldownKey)} turnos)`
          : "";

        const custoTexto = Object.entries(habilidade.custo)
          .map(([tipo, valor]) => `${valor} ${tipo.toUpperCase()}`)
          .join(", ");

        return `
                    <div class="habilidade-card ${
                      !temRecursos || emCooldown ? "desabilitada" : ""
                    }" 
                         onclick="usarHabilidade(${index})">
                        <h4>${habilidade.nome}${cooldownTexto}</h4>
                        <p>${habilidade.descricao}</p>
                        <div class="custo">${custoTexto}</div>
                    </div>
                `;
      })
      .join("");
  }
}

// Exportar para uso global
if (typeof window !== "undefined") {
  window.SistemaCombate = SistemaCombate;
}
