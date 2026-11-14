const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.mainnav');
if (navToggle) {
  navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
}

const cuidadosPorIdade = {
  filhote: {
    titulo: 'Filhote (até 6 meses)',
    itens: [
      'Ainda mama até por volta das 8 semanas; a partir daí, introduza feno aos poucos.',
      'Evite pegar no colo por longos períodos — os ossos ainda são frágeis.',
      'Marque a primeira consulta veterinária para avaliação geral e castração futura.'
    ]
  },
  adulto: {
    titulo: 'Adulto (6 meses a 6 anos)',
    itens: [
      'Feno à vontade, ração em quantidade controlada e vegetais frescos diariamente.',
      'Pelo menos algumas horas por dia fora da gaiola, em espaço seguro.',
      'Check-up veterinário uma vez por ano, mesmo sem sinais de problema.'
    ]
  },
  idoso: {
    titulo: 'Idoso (6+ anos)',
    itens: [
      'Fique atento a mudanças de apetite ou de peso — costumam ser os primeiros sinais.',
      'Facilite o acesso à água e ao feno, evitando que precise pular muito alto.',
      'Consultas mais frequentes, a cada seis meses, ajudam a identificar problemas cedo.'
    ]
  }
};

const tabs = document.querySelectorAll('.idade-tab');
const conteudo = document.getElementById('idadeConteudo');

function renderizar(idade) {
  const dados = cuidadosPorIdade[idade];
  conteudo.innerHTML = `
    <h3>${dados.titulo}</h3>
    <ul>${dados.itens.map((item) => `<li>${item}</li>`).join('')}</ul>
  `;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('ativo'));
    tab.classList.add('ativo');
    renderizar(tab.dataset.idade);
  });
});

renderizar('filhote');

