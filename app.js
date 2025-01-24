// Variáveis iniciais
let vidaJogador = 50;
let vidaInimigo = 50;

function exibirHistoria(mensagem) {
    document.getElementById("historia").textContent = mensagem;
}

function exibirOpcoes(opcoes) {
    let opcoesHTML = "";
    opcoes.forEach(opcao => {
        opcoesHTML += `<button onclick="executarAcao('${opcao}')">${opcao}</button>`;
    });
    document.getElementById("opcoes").innerHTML = opcoesHTML;
}

function atacar() {
    const dano = Math.floor(Math.random() * 20) + 5; // Dano aleatório entre 5 e 25
    vidaInimigo -= dano;
    exibirHistoria(`Você atacou o inimigo e causou ${dano} de dano!`);
    verificarEstado();
}

function defender() {
    const defesa = Math.floor(Math.random() * 10) + 5; // Defesa aleatória
    vidaJogador += defesa;
    exibirHistoria(`Você se defendeu e ganhou ${defesa} de vida!`);
    verificarEstado();
}

function inimigoAtacar() {
    const dano = Math.floor(Math.random() * 15) + 5; // Dano do inimigo
    vidaJogador -= dano;
    exibirHistoria(`O inimigo te atacou e causou ${dano} de dano!`);
    verificarEstado();
}

function verificarEstado() {
    document.getElementById("vidaJogador").textContent = vidaJogador;
    document.getElementById("vidaInimigo").textContent = vidaInimigo;

    if (vidaJogador <= 0) {
        exibirHistoria("Você foi derrotado. Fim de jogo!");
        document.getElementById("opcoes").innerHTML = "";
    } else if (vidaInimigo <= 0) {
        exibirHistoria("Você derrotou o inimigo! Parabéns!");
        document.getElementById("opcoes").innerHTML = "";
    } else {
        exibirOpcoes(["Atacar", "Defender"]);
    }
}

// Início do jogo
function iniciarJogo() {
    exibirHistoria("Você encontra um inimigo feroz no caminho. O que fará?");
    exibirOpcoes(["Atacar", "Defender"]);
}

function executarAcao(acao) {
    if (acao === "Atacar") {
        atacar();
        inimigoAtacar();
    } else if (acao === "Defender") {
        defender();
        inimigoAtacar();
    }
}
// Função para verificar o estado após cada ação
function verificarEstado() {
    document.getElementById("vidaJogador").textContent = vidaJogador;
    document.getElementById("vidaInimigo").textContent = vidaInimigo;

    // Verifica se o jogador perdeu
    if (vidaJogador <= 0) {
        exibirHistoria("Você foi derrotado. Fim de jogo!");
        document.getElementById("opcoes").innerHTML = "";
    }
    // Verifica se o inimigo foi derrotado
    else if (vidaInimigo <= 0) {
        exibirHistoria("Você derrotou o inimigo! Parabéns!");
        document.getElementById("opcoes").innerHTML = "";
    }
    // Caso contrário, oferece as opções de ação
    else {
        exibirOpcoes(["Atacar", "Defender"]);
    }
}

// Alterando a função de ação do inimigo para verificar o estado após atacar
function inimigoAtacar() {
    const dano = Math.floor(Math.random() * 15) + 5; // Dano do inimigo
    vidaJogador -= dano;
    exibirHistoria(`O inimigo te atacou e causou ${dano} de dano!`);
    verificarEstado(); // Verifica o estado após o ataque do inimigo
}

iniciarJogo();