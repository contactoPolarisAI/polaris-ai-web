import Chart from 'chart.js/auto';

export const ChartManager = {
  init() {
    this.initDefaultConfig();
    this.initBarsChart();
    this.initLineChart();
    this.initDonutChart();
    this.initHorizontalBarsChart();
  },

  initDefaultConfig() {
    Chart.defaults.color = '#4A5568';
    Chart.defaults.borderColor = 'rgba(15,37,71,.06)';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  },

  initBarsChart() {
    const canvas = document.getElementById('chart-bars');
    if (!canvas) return;

    const C_BLUE = '#2E75B6';
    const C_GREY_LT = '#CBD5E0';
    const TICK = '#4A5568';
    const GRID = 'rgba(15,37,71,.06)';
    const TT_BG = '#0F2547';
    const TT_BORDER = 'rgba(46,117,182,.4)';

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Facturas', 'Stock', 'Reportes', 'WhatsApp', 'Errores'],
        datasets: [
          { label: 'Sin Polaris AI', data: [3.8, 2.8, 3.5, 2.7, 1.4], backgroundColor: C_GREY_LT, borderRadius: 4, barPercentage: 0.55, categoryPercentage: 0.7 },
          { label: 'Con Polaris AI', data: [0.4, 0.5, 0.4, 0.3, 0.2], backgroundColor: C_BLUE,    borderRadius: 4, barPercentage: 0.55, categoryPercentage: 0.7 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, padding: 16, font: { size: 11 }, color: TICK } },
          tooltip: { backgroundColor: TT_BG, borderColor: TT_BORDER, borderWidth: 1, padding: 10, callbacks: { label: (c) => c.dataset.label + ': ' + c.parsed.y + 'h' } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: TICK } },
          y: { grid: { color: GRID }, ticks: { color: TICK, callback: (v) => v + 'h' } }
        }
      }
    });
  },

  initLineChart() {
    const canvas = document.getElementById('chart-line');
    if (!canvas) return;

    const C_BLUE = '#2E75B6';
    const C_GREEN = '#38A169';
    const TICK = '#4A5568';
    const GRID = 'rgba(15,37,71,.06)';
    const TT_BG = '#0F2547';
    const TT_BORDER = 'rgba(46,117,182,.4)';

    const ctx = canvas.getContext('2d');
    const grad1 = ctx.createLinearGradient(0, 0, 0, 250);
    grad1.addColorStop(0, 'rgba(46,117,182,.28)');
    grad1.addColorStop(1, 'rgba(46,117,182,0)');
    const grad2 = ctx.createLinearGradient(0, 0, 0, 250);
    grad2.addColorStop(0, 'rgba(56,161,105,.22)');
    grad2.addColorStop(1, 'rgba(56,161,105,0)');

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'],
        datasets: [
          { label: 'Reducción tiempo manual', data: [12, 28, 41, 55, 65, 73], borderColor: C_BLUE,  backgroundColor: grad1, fill: true, tension: 0.35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: C_BLUE },
          { label: 'Reducción de errores',     data: [8,  22, 38, 58, 74, 91], borderColor: C_GREEN, backgroundColor: grad2, fill: true, tension: 0.35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: C_GREEN }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, padding: 16, font: { size: 11 }, color: TICK } },
          tooltip: { backgroundColor: TT_BG, borderColor: TT_BORDER, borderWidth: 1, padding: 10, callbacks: { label: (c) => c.dataset.label + ': ' + c.parsed.y + '%' } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: TICK } },
          y: { min: 0, max: 100, grid: { color: GRID }, ticks: { color: TICK, stepSize: 25, callback: (v) => v + '%' } }
        }
      }
    });
  },

  initDonutChart() {
    const canvas = document.getElementById('chart-donut');
    if (!canvas) return;

    const C_BLUE = '#2E75B6';
    const C_GREEN = '#38A169';
    const C_PURPLE = '#7C5BD9';
    const C_AMBER = '#E5A04B';
    const C_GREY_DK = '#94A0B6';
    const TT_BG = '#0F2547';
    const TT_BORDER = 'rgba(46,117,182,.4)';

    const donutLabels = ['Gestión facturas', 'Control de stock', 'Informes y reportes', 'Consultas WhatsApp', 'Otras tareas'];
    const donutData   = [32, 25, 22, 13, 8];
    const donutColors = [C_BLUE, C_GREEN, C_PURPLE, C_AMBER, C_GREY_DK];

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: donutLabels,
        datasets: [{ data: donutData, backgroundColor: donutColors, borderColor: '#fff', borderWidth: 3, hoverOffset: 6 }]
      },
      options: {
        responsive: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: TT_BG, borderColor: TT_BORDER, borderWidth: 1, padding: 10, callbacks: { label: (c) => c.label + ': ' + c.parsed + '%' } }
        }
      }
    });

    const legend = document.getElementById('donut-legend');
    if (legend) {
      legend.innerHTML = donutLabels.map((l, i) => `
        <li><span class="sw" style="background:${donutColors[i]}"></span><span>${l}</span><span class="val">${donutData[i]}%</span></li>
      `).join('');
    }
  },

  initHorizontalBarsChart() {
    const canvas = document.getElementById('chart-hbars');
    if (!canvas) return;

    const C_NAVY = '#1B3A6B';
    const C_GREY_DK = '#94A0B6';
    const C_GREY_LT = '#CBD5E0';
    const GRID = 'rgba(15,37,71,.06)';
    const TT_BG = '#0F2547';
    const TT_BORDER = 'rgba(46,117,182,.4)';

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Privacidad datos', 'Sin internet OK', 'Aprende tu empresa', 'Fácil para PYMEs', 'Coste/beneficio'],
        datasets: [
          { label: 'Polaris AI',   data: [100, 100, 95, 87, 92], backgroundColor: C_NAVY,    borderRadius: 4, barPercentage: 0.65, categoryPercentage: 0.85 },
          { label: 'Copilot 365',  data: [35,  0,   28, 62, 44], backgroundColor: C_GREY_DK, borderRadius: 4, barPercentage: 0.65, categoryPercentage: 0.85 },
          { label: 'ChatGPT Team', data: [22,  0,   24, 58, 39], backgroundColor: C_GREY_LT, borderRadius: 4, barPercentage: 0.65, categoryPercentage: 0.85 }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: TT_BG, borderColor: TT_BORDER, borderWidth: 1, padding: 10, callbacks: { label: (c) => c.dataset.label + ': ' + c.parsed.x } }
        },
        scales: {
          x: { min: 0, max: 100, grid: { color: GRID }, ticks: { display: false } },
          y: { grid: { display: false }, ticks: { color: '#1A1A2E', font: { size: 12, weight: '500' } } }
        }
      }
    });
  }
};
