const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.mainnav');
if (navToggle) {
  navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
}

const quizGato = document.getElementById('quizGato');
if (quizGato) {
  const perguntas = quizGato.querySelectorAll('.pergunta');
  const resultadoBox = document.getElementById('resultadoGato');
  const tituloResultado = document.getElementById('tituloResultadoGato');
  const textoResultado = document.getElementById('textoResultadoGato');
  const refazerBtn = document.getElementById('refazerGato');

  const pontos = { cacador: 0, social: 0, tranquilo: 0 };

  const perfis = {
    cacador: {
      titulo: 'Caçador nato',
      texto: 'Seu gato precisa gastar energia. Brinquedos que imitam presas e sessões curtas de caça simulada ajudam bastante.'
    },
    social: {
      titulo: 'Sociável',
      texto: 'Ele gosta de companhia. Separe um tempo do dia só para brincar e fazer carinho — isso faz diferença no bem-estar dele.'
    },
    tranquilo: {
      titulo: 'Caseiro tranquilo',
      texto: 'Prefere paz e um cantinho confortável. Um bom arranhador e uma cama aconchegante já fazem ele feliz.'
    }
  };

  function proximaPergunta(atual) {
    perguntas[atual].hidden = true;
    if (perguntas[atual + 1]) {
      perguntas[atual + 1].hidden = false;
    } else {
      mostrarResultado();
    }
  }

  function mostrarResultado() {
    const vencedor = Object.keys(pontos).reduce((a, b) => (pontos[a] >= pontos[b] ? a : b));
    resultadoBox.hidden = false;
    tituloResultado.textContent = perfis[vencedor].titulo;
    textoResultado.textContent = perfis[vencedor].texto;
  }

  perguntas.forEach((pergunta, indice) => {
    pergunta.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        pontos[btn.dataset.pontos]++;
        proximaPergunta(indice);
      });
    });
  });

  refazerBtn.addEventListener('click', () => {
    pontos.cacador = 0;
    pontos.social = 0;
    pontos.tranquilo = 0;
    resultadoBox.hidden = true;
    perguntas.forEach((p, i) => (p.hidden = i !== 0));
  });
}

