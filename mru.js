
  const posicoes = Array.from({ length: 11 }, (_, i) => i * 2);

  // Criar linhas da tabela de ida
  const tbodyIda = document.getElementById("tempoIda");
  posicoes.forEach((pos, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pos}</td>
      <td><input type="number" step="0.1" id="tIda${i}" /></td>
      <td id="vmIda${i}">-</td>
    `;
    tbodyIda.appendChild(row);
  });

  // Criar linhas da tabela de volta (mesmas posições, mas novos inputs)
  const tbodyVolta = document.getElementById("tempoVolta");
  posicoes.forEach((pos, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pos}</td>
      <td><input type="number" step="0.1" id="tVolta${i}" /></td>
      <td id="vmVolta${i}">-</td>
    `;
    tbodyVolta.appendChild(row);
  });

  function calcular() {
    const temposIda = posicoes.map((_, i) =>
      parseFloat(document.getElementById(`tIda${i}`).value)
    );
    const temposVolta = posicoes.map((_, i) =>
      parseFloat(document.getElementById(`tVolta${i}`).value)
    );

    const posicoesTotais = [...posicoes, ...posicoes.slice().reverse()];
    const temposTotais = [...temposIda, ...temposVolta];

    const velocidades = [];
    const aceleracoes = [];

    for (let i = 1; i < temposTotais.length; i++) {
      const deltaS = posicoesTotais[i] - posicoesTotais[i - 1];
      const deltaT = temposTotais[i] - temposTotais[i - 1];

      const vm = isFinite(deltaT) && deltaT !== 0 ? deltaS / deltaT : 0;
      velocidades.push(isFinite(vm) ? vm.toFixed(2) : 0);
      aceleracoes.push(0); // MRU

      if (i < temposIda.length) {
        document.getElementById(`vmIda${i}`).innerText = isFinite(vm) ? vm.toFixed(2) : "-";
      } else {
        const j = i - temposIda.length;
        document.getElementById(`vmVolta${j}`).innerText = isFinite(vm) ? vm.toFixed(2) : "-";
      }
    }

    // Primeiras linhas (sem velocidade)
    document.getElementById("vmIda0").innerText = "-";
    document.getElementById("vmVolta0").innerText = "-";
    velocidades.unshift(velocidades[0]);
    aceleracoes.unshift(0);

    // Geração dos gráficos com ida + volta
    gerarGrafico("graficoPosicao", "Posição x Tempo (Ida + Volta)", temposTotais, posicoesTotais, 'Posição (m)', 'rgb(0,102,204)');
    gerarGrafico("graficoVelocidade", "Velocidade x Tempo (Ida + Volta)", temposTotais, velocidades, 'Velocidade (m/s)', 'rgb(0,153,0)');
    gerarGrafico("graficoAceleracao", "Aceleração x Tempo (Ida + Volta)", temposTotais, aceleracoes, 'Aceleração (m/s²)', 'rgb(204,0,0)');
  }

  function gerarGrafico(canvasId, titulo, labels, dados, yLabel, cor) {
    new Chart(document.getElementById(canvasId), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: yLabel,
          data: dados,
          borderColor: cor,
          borderWidth: 2,
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: titulo }
        },
        scales: {
          x: { title: { display: true, text: 'Tempo (s)' }},
          y: { title: { display: true, text: yLabel }}
        }
      }
    });
  }

