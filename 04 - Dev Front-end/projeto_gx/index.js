document.addEventListener('DOMContentLoaded', () => {
  // Status da loja (aberto/fechado) com base no horário: seg. a sáb., 9h às 19h
  const statusPonto = document.getElementById('statusPonto');
  const statusTexto = document.getElementById('statusTexto');
  if (statusPonto && statusTexto) {
    const agora = new Date();
    const dia = agora.getDay(); // 0 = domingo, 6 = sábado
    const hora = agora.getHours();
    const diaUtil = dia >= 1 && dia <= 6;
    const dentroDoHorario = hora >= 9 && hora < 19;
    const aberto = diaUtil && dentroDoHorario;

    statusPonto.classList.add(aberto ? 'aberto' : 'fechado');
    statusTexto.textContent = aberto
      ? 'Aberto agora — atendimento até 19h'
      : 'Fechado no momento — volta seg. a sáb., às 9h';
  }

  // Copiar telefone e e-mail
  const copiaAviso = document.getElementById('copiaAviso');
  function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
      if (!copiaAviso) return;
      copiaAviso.removeAttribute('hidden');
      copiaAviso.classList.remove('escondido');
      clearTimeout(copiarTexto._timer);
      copiarTexto._timer = setTimeout(() => {
        copiaAviso.setAttribute('hidden', '');
        copiaAviso.classList.add('escondido');
      }, 2500);
    });
  }

  const copiarTelefoneBtn = document.getElementById('copiarTelefone');
  if (copiarTelefoneBtn) {
    copiarTelefoneBtn.addEventListener('click', () => copiarTexto('(11) 4002-8922'));
  }

  const copiarEmailBtn = document.getElementById('copiarEmail');
  if (copiarEmailBtn) {
    copiarEmailBtn.addEventListener('click', () => copiarTexto('contato@tocaecia.com.br'));
  }

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.querySelector('.mainnav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  // Quiz "não sei qual é o meu bicho"
  const quiz = document.getElementById('quiz');
  if (quiz) {
    const passo1 = quiz.querySelector('[data-step="1"]');
    const passo2 = quiz.querySelector('[data-step="2"]');
    const resultadoBox = document.getElementById('resultado');
    const resultadoTitulo = document.getElementById('resultadoTitulo');
    const resultadoTexto = document.getElementById('resultadoTexto');
    const resultadoLink = document.getElementById('resultadoLink');
    const refazerBtn = document.getElementById('refazer');

    const respostas = { moradia: null, tempo: null };

    const perfis = {
      cao: {
        titulo: 'Um cão vai combinar com você',
        texto: 'Cães quintaleiros ou apartamento amplo, com tempo livre pra passear, se dão muito bem com você. Veja rações, portes e a calculadora de alimentação.',
        link: '/cão/cao.html'
      },
      gato: {
        titulo: 'Um gato vai combinar com você',
        texto: 'Independente e adaptável a espaços menores, o gato pede menos tempo diário. Confira o teste de personalidade felina.',
        link: '/gato/gato.html'
      },
      ave: {
        titulo: 'Uma ave vai combinar com você',
        texto: 'Companhia sonora que ocupa pouco espaço no chão. Veja o guia de gaiola ideal por espécie.',
        link: '/aves/aves.html'
      },
      coelho: {
        titulo: 'Um coelho vai combinar com você',
        texto: 'Quieto, caseiro e ótimo para apartamentos pequenos com rotina de cuidado diária. Veja os cuidados por idade.',
        link: '/coelho/coelho.html'
      }
    };

    function ocultarElemento(el) {
      if (!el) return;
      el.setAttribute('hidden', '');
      el.classList.add('escondido');
    }

    function mostrarElemento(el) {
      if (!el) return;
      el.removeAttribute('hidden');
      el.classList.remove('escondido');
    }

    function calcularPerfil() {
      const { moradia, tempo } = respostas;
      if (moradia === 'casa-quintal' && tempo !== 'pouco') return 'cao';
      if (moradia === 'apartamento-pequeno' && tempo === 'pouco') return 'coelho';
      if (tempo === 'muito') return 'cao';
      if (moradia === 'apartamento-grande' && tempo === 'medio') return 'gato';
      if (tempo === 'pouco') return 'ave';
      return 'gato';
    }

    function mostrarResultado() {
      const perfil = perfis[calcularPerfil()];
      ocultarElemento(passo1);
      ocultarElemento(passo2);
      mostrarElemento(resultadoBox);

      if (resultadoTitulo) resultadoTitulo.textContent = perfil.titulo;
      if (resultadoTexto) resultadoTexto.textContent = perfil.texto;
      if (resultadoLink) {
        resultadoLink.href = perfil.link;
        resultadoLink.textContent = 'Conhecer página';
      }
    }

    // Eventos Passo 1
    if (passo1) {
      passo1.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const valor = e.currentTarget.getAttribute('data-valor');
          if (valor) {
            respostas.moradia = valor;
            ocultarElemento(passo1);
            mostrarElemento(passo2);
          }
        });
      });
    }

    // Eventos Passo 2
    if (passo2) {
      ocultarElemento(passo2); // Garante estado inicial correto
      passo2.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const valor = e.currentTarget.getAttribute('data-valor');
          if (valor) {
            respostas.tempo = valor;
            mostrarResultado();
          }
        });
      });
    }

    // Evento Refazer
    if (refazerBtn) {
      refazerBtn.addEventListener('click', () => {
        respostas.moradia = null;
        respostas.tempo = null;
        ocultarElemento(resultadoBox);
        mostrarElemento(passo1);
        ocultarElemento(passo2);
      });
    }
  }
});
