const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.mainnav');
if (navToggle) {
  navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
}

const calcularBtn = document.getElementById('calcularBtn');
const calcResultado = document.getElementById('calcResultado');
const gramasDiaEl = document.getElementById('gramasDia');
const detalheEl = document.getElementById('detalheRefeicoes');

// Fatores aproximados de gramas de ração por kg de peso corporal, por fase de vida.
// Estimativa educativa — a embalagem da ração e o médico-veterinário têm a palavra final.
const fatorPorFase = {
  filhote: 45,
  adulto: 28,
  idoso: 22
};
const refeicoesPorFase = {
  filhote: 3,
  adulto: 2,
  idoso: 2
};

calcularBtn.addEventListener('click', () => {
  const peso = parseFloat(document.getElementById('peso').value);
  const fase = document.getElementById('fase').value;

  if (!peso || peso <= 0) {
    calcResultado.hidden = false;
    gramasDiaEl.textContent = '—';
    detalheEl.textContent = 'Informe o peso do cão para calcular.';
    return;
  }

  const gramas = Math.round(peso * fatorPorFase[fase]);
  const refeicoes = refeicoesPorFase[fase];
  const porRefeicao = Math.round(gramas / refeicoes);

  gramasDiaEl.textContent = gramas;
  detalheEl.textContent = `Dividido em ${refeicoes} refeições, cerca de ${porRefeicao} g cada uma.`;
  calcResultado.hidden = false;
});

