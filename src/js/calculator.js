export const RoiCalculator = {
  init() {
    const empleadosEl = document.getElementById('roi-empleados');
    if (!empleadosEl) return;

    this.fields = {
      empleados: { el: empleadosEl,       vEl: document.getElementById('roi-empleados-v') },
      horas:     { el: document.getElementById('roi-horas'),    vEl: document.getElementById('roi-horas-v') },
      coste:     { el: document.getElementById('roi-coste'),    vEl: document.getElementById('roi-coste-v') },
      auto:      { el: document.getElementById('roi-auto'),     vEl: document.getElementById('roi-auto-v') }
    };

    this.plan = { mensual: 429, setup: 2000, name: 'Beta Plus' };

    // Agregar listeners a los inputs
    Object.values(this.fields).forEach(f => {
      f.el.addEventListener('input', () => this.recompute());
    });

    // Agregar listeners a la selección de planes
    document.querySelectorAll('.roi-plan').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.roi-plan').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        this.plan = {
          mensual: +btn.dataset.mensual,
          setup:   +btn.dataset.setup,
          name:    btn.querySelector('.plan-name').textContent
        };
        this.recompute();
      });
    });

    this.recompute();
  },

  fmtMoney(n) {
    const sign = n < 0 ? '-' : '';
    return sign + Math.abs(Math.round(n)).toLocaleString('es-ES') + ' €';
  },

  fmtMoneyBig(n) {
    const sign = n < 0 ? '-' : '';
    return sign + Math.abs(Math.round(n)).toLocaleString('es-ES') + '<span class="u"> €</span>';
  },

  updateSliderFill(el) {
    const min = +el.min, max = +el.max, val = +el.value;
    const pct = ((val - min) / (max - min)) * 100;
    el.style.setProperty('--val', pct + '%');
  },

  recompute() {
    const emp   = +this.fields.empleados.el.value;
    const horas = +this.fields.horas.el.value;
    const coste = +this.fields.coste.el.value;
    const auto  = +this.fields.auto.el.value / 100;

    this.fields.empleados.vEl.textContent = emp;
    this.fields.horas.vEl.textContent     = horas;
    this.fields.coste.vEl.textContent     = coste;
    this.fields.auto.vEl.textContent      = (auto * 100).toFixed(0);
    
    Object.values(this.fields).forEach(f => this.updateSliderFill(f.el));

    const horasMes    = horas * 4.33;
    const costeMes    = emp * horasMes * coste;
    const costeAnual  = costeMes * 12;
    const ahorroMes   = costeMes * auto;
    const ahorroAnual = ahorroMes * 12;
    const cuotaAnual  = this.plan.mensual * 12;
    const setupAmort  = this.plan.setup / 3;
    const roiMes      = ahorroMes - this.plan.mensual;
    const beneficio1  = ahorroAnual - cuotaAnual - this.plan.setup;
    const payback     = roiMes > 0 ? (this.plan.setup / roiMes) : Infinity;

    document.getElementById('r-cost-mes').innerHTML       = this.fmtMoneyBig(costeMes);
    document.getElementById('r-ahorro-mes').innerHTML     = this.fmtMoneyBig(ahorroMes);
    document.getElementById('r-roi-mes').innerHTML        = this.fmtMoneyBig(roiMes);
    document.getElementById('r-cost-anual').textContent   = this.fmtMoney(costeAnual);
    document.getElementById('r-ahorro-anual').textContent = this.fmtMoney(ahorroAnual);
    document.getElementById('r-cuota-anual').textContent  = this.fmtMoney(cuotaAnual);
    document.getElementById('r-setup').textContent        = this.fmtMoney(this.plan.setup) + ' (≈ ' + this.fmtMoney(setupAmort) + '/año)';
    document.getElementById('r-beneficio').textContent    = this.fmtMoney(beneficio1);
    document.getElementById('r-payback').textContent      = isFinite(payback) ? payback.toFixed(1) + ' meses' : '— no rentable';

    const roiCard = document.getElementById('r-roi-mes').closest('.roi-result-big');
    if (roiCard) {
      roiCard.classList.toggle('pos', roiMes >= 0);
      roiCard.classList.toggle('neg', roiMes < 0);
    }

    const callout = document.getElementById('r-callout');
    if (roiMes >= 0) {
      const mult = ahorroMes > 0 ? (ahorroMes / this.plan.mensual) : 0;
      callout.innerHTML = `Con el plan <strong>${this.plan.name}</strong> recuperas tu inversión en <strong>${isFinite(payback) ? payback.toFixed(1) : '—'} meses</strong> y multiplicas por <strong>${mult.toFixed(1)}×</strong> lo que pagas cada mes.`;
    } else {
      callout.innerHTML = `Con estos parámetros, el plan <strong>${this.plan.name}</strong> aún no es rentable. Prueba un plan inferior o aumenta empleados / horas.`;
    }

    // Actualizar enlace de WhatsApp del botón diagnóstico
    const btnDiag = document.querySelector('.roi-results .roi-cta');
    if (btnDiag) {
      const textMsg = `Hola Polaris AI, he calculado mi diagnóstico con vuestra calculadora y me gustaría agendar una demo privada.

Mis datos del diagnóstico:
- Empleados en tareas mecánicas: ${emp}
- Horas semanales por empleado: ${horas} h
- Coste por hora: ${coste} €/h
- Automatización estimada: ${(auto * 100).toFixed(0)}%
- Plan sugerido: ${this.plan.name}

Resultados calculados:
- Coste actual: ${this.fmtMoney(costeMes)}/mes
- Ahorro estimado con Polaris: ${this.fmtMoney(ahorroMes)}/mes
- Retorno neto mensual: ${this.fmtMoney(roiMes)}/mes`;

      btnDiag.href = `https://wa.me/34602025877?text=${encodeURIComponent(textMsg)}`;
      btnDiag.target = '_blank';
    }
  }
};
