const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.mainnav');
if (navToggle) {
  navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
}

const verGaiolaBtn = document.getElementById('verGaiolaBtn');
const gaiolaResultado = document.getElementById('gaiolaResultado');
const gaiolaMedida = document.getElementById('gaiolaMedida');
const gaiolaDetalhe = document.getElementById('gaiolaDetalhe');

const medidas = {
  periquito: {
    medida: '60 x 40 x 40 cm (mínimo)',
    detalhe: 'Prefira gaiolas horizontais: periquitos voam mais de um lado a outro do que para cima.'
  },
  calopsita: {
    medida: '80 x 50 x 60 cm (mínimo)',
    detalhe: 'Espaço extra para abrir as asas por completo e ao menos dois poleiros em alturas diferentes.'
  },
  canario: {
    medida: '50 x 30 x 35 cm (mínimo)',
    detalhe: 'Gaiola mais alongada favorece pequenos voos, importantes para o canto e a saúde do canário.'
  },
  agapornis: {
    medida: '60 x 45 x 50 cm (mínimo)',
    detalhe: 'Espécie ativa: inclua brinquedos para roer e balançar, além de poleiros variados.'
  }
};

verGaiolaBtn.addEventListener('click', () => {
  const especie = document.getElementById('especieAve').value;
  const info = medidas[especie];
  gaiolaMedida.textContent = info.medida;
  gaiolaDetalhe.textContent = info.detalhe;
  gaiolaResultado.hidden = false;
});

