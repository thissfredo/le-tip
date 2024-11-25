<template>
  <div class="container">
    <div class="tip-calculator">

      <div class="tip-calculator__title">
        <h1>Le/Tip</h1>
      </div>

      <div class="tip-calculator__calculator">

        <!-- Cálculos -->
        <div class="tip-calculator__operator" :class="{ 'tip-calculator__results--hidden': isMobile && panel }">

          <!-- Switch para troca de moedas -->
          <div class="tip-calculator__currency-switch">
            <span class="tip-calculator__name-left">EUR</span>
            <BaseInputSwitch v-model="checked" />
            <span class="tip-calculator__name-right">USD</span>
          </div>

          <!-- Input de valor -->
          <div class="tip-calculator__currency-value">
            <span class="tip-calculator__currency-value-name">Valor</span>
            <span class="tip-calculator__currency-value-symbol">{{ currentCurrencySymbol }}</span>
            <BaseInput v-model="value" :type="'number'" :min="0" />
          </div>

          <!-- Gorjeta -->
          <div class="tip-calculator__tip-slider">
            <div class="tip-calculator__tip-slider-name">
              <span class="tip-calculator__tip-name">Gorjeta</span>
              <span class="tip-calculator__tip-value">{{ tipValue }}</span>
            </div>
            <div class="tip-calculator__tip-slider-container">
              <label class="tip-calculator__name-left">10</label>
              <BaseInputSlider :min="10" :max="20" v-model="tip" />
              <span class="tip-calculator__name-right">20</span>
            </div>
          </div>

          <!-- Número de pessoas -->
          <div class="tip-calculator__people-slider">
            <div class="tip-calculator__people-slider-name">
              <span class="tip-calculator__people-name">Pessoas</span>
              <span class="tip-calculator__people-value">{{ people }}</span>
            </div>
            <div class="tip-calculator__people-slider-container">
              <span class="tip-calculator__name-left">2</span>
              <BaseInputSlider :min="2" :max="16" v-model="people" />
              <span class="tip-calculator__name-right">16</span>
            </div>
          </div>
        </div>

        <!-- Resultados -->
          <div class="tip-calculator__results" :class="{ 'tip-calculator__results--hidden': isMobile && !panel }">
            <div>
              <span class="tip-calculator__result-name">Conta</span>
              <div class="tip-calculator__result-total">{{ `${currentCurrencySymbol} ${value}` }}</div>
            </div>
            <div>
              <span class="tip-calculator__result-name">Gorjeta</span>
              <div class="tip-calculator__result-total">{{ `${currentCurrencySymbol} ${totalTip}` }}</div>
            </div>
            <div>
              <span class="tip-calculator__result-name">Total</span>
              <div class="tip-calculator__result-total">{{ `${currentCurrencySymbol} ${totalValue}` }}</div>
            </div>
            <div>
              <span class="tip-calculator__result-name">Por pessoa</span>
              <div class="tip-calculator__result-total">{{ `${currentCurrencySymbol} ${byPerson}` }}</div>
            </div>
            <div>
              <span class="tip-calculator__result-name">em R$</span>
              <div class="tip-calculator__result-total">{{ `${quoteCurrencySymbol} ${valueToBRL}` }}</div>
            </div>
          </div>
      </div>
      <div class="tip-calculator__button-container">
        <button class="tip-calculator__button" v-if="isMobile" @click="handlePanel">
          <i class="tip-calculator__button--icon" :class="icon"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import QuotationRepository from '@/repositories/QuotationRepository';
import BaseInputSlider from './BaseInputSlider.vue';
import BaseInputSwitch from './BaseInputSwitch.vue';
import BaseInput from './BaseInput.vue';
export default {
  name: 'TipCalculator',
  components: {
    BaseInputSlider,
    BaseInput,
    BaseInputSwitch
  },
  data() {
    return {
      value: 0,
      tip: 10,
      people: 2,
      checked: true,
      currency: {
        base_currency: 'USD',
        quote_currency: 'BRL'
      },
      currencies: {
        USD: { symbol: '$' },
        EUR: { symbol: '€' },
        BRL: { symbol: 'R$' }
      },
      rate: {},
      isMobile: false,
      panel: false
    };
  },
  mounted() {
    this.getRates();
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  watch: {
    checked: function () {
      this.handleCurrencyChange()
    }
  },
  methods: {
    async getRates() {
      try {
        const response = await QuotationRepository.get(this.currency);
        this.rate = response.data[`${this.currency.base_currency}${this.currency.quote_currency}`];
      } catch (error) {
        console.error('Erro ao buscar taxas de câmbio:', error);
      }
    },
    handleCurrencyChange() {
      this.currency.base_currency = this.checked ? 'USD' : 'EUR';
      this.getRates();
    },
    handlePanel() {
      this.panel = !this.panel
    },
    onResize() {
      this.isMobile = window.innerWidth < 600
    },
    formatBRL(num) {
      return num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    }
  },
  computed: {
    tipValue() {
      return `${this.tip}%`
    },
    icon() {
      return this.panel ? 'mdi mdi-chevron-left' : 'mdi mdi-chevron-right'
    },
    // Símbolos das moedas base e de cotação
    baseCurrencySymbol() {
      return this.currencies[this.currency.base_currency]?.symbol || '';
    },
    quoteCurrencySymbol() {
      return this.currencies[this.currency.quote_currency]?.symbol || '';
    },
    currentCurrencySymbol() {
      return this.baseCurrencySymbol;
    },
    // Cálculos
    totalTip() {
      return +(Number(this.value) * this.tip / 100).toFixed(2);
    },
    totalValue() {
      return +(Number(this.value) + this.totalTip).toFixed(2);
    },
    byPerson() {
      return +(this.totalValue / this.people).toFixed(2);
    },
    valueToBRL() {
      if (this.rate.ask) {
        return this.formatBRL(+(this.byPerson * this.rate.ask).toFixed(2))
      }
      return 0;
    }
  },
  beforeDestroy() {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  },

};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  align-items: center;
}

.tip-calculator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
  width: 100%;
  gap: 50px;
}

.tip-calculator__calculator {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: baseline;
  height: 100%;
  width: 50%;
}

.tip-calculator__operator,
.tip-calculator__results {

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 200px;
}

.tip-calculator__currency-switch {
  display: flex;
  align-items: center;
  gap: 15px;
}

.tip-calculator__currency-value {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
}

.tip-calculator__currency-value-name {
  font-size: var(--font-size-small);
}

.tip-calculator__currency-value-symbol {
  font-size: var(--font-size-large)
}


.tip-calculator__tip-slider,
.tip-calculator__people-slider {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-calculator__tip-slider-container,
.tip-calculator__people-slider-container {
  display: flex;
  align-items: center
}

.tip-calculator__tip-slider-name,
.tip-calculator__people-slider-name {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
}

.tip-calculator__results--hidden {
  display: none;
}

.tip-calculator__tip-name,
.tip-calculator__people-name {
  font-size: var(--font-size-small);
}

.tip-calculator__tip-value,
.tip-calculator__people-value {
  font-size: var(--font-size-large);
}

.tip-tip-calculator__name-left,
.tip-tip-calculator__name-right {
  font-size: var(--font-size-small);
}

.tip-calculator__result-name {
  font-size: var(--font-size-small);
}

.tip-calculator__result-total {
  font-size: var(--font-size-large);
}


.tip-calculator__title h1 {
  color: var(--secondary-color);
  overflow: hidden;
  font-size: 40px;
  border-right: .15em solid var(--secondary-color);
  white-space: nowrap;
  margin: 0 auto;
  top: 20px;
  letter-spacing: .15em;
  animation:
    typing 1.5s steps(30, end),
    blink-caret .5s step-end infinite;
}

@keyframes typing {
  from {
    width: 0
  }

  to {
    width: 100%
  }
}

@keyframes blink-caret {

  from,
  to {
    border-color: transparent
  }

  50% {
    border-color: var(--secondary-color)
  }
}

.tip-calculator__button-container {
  display: flex;
  align-items: center;
  width: 70%;
  justify-content: flex-end;
  height: 50px
}

.tip-calculator__button {
  border-radius: 100%;
  height: 40px;
  width: 40px;
  border: none;
  background-color: #2c3e50;
}

.tip-calculator__button--icon {
  font-size: 20px;
  color: #FDFDFD;
}

@media (max-width: 600px) {
  .tip-calculator {
    width: 100%;
  }

  .tip-calculator__calculator {
    flex-direction: column;
    height: 100%;
  }

  .tip-calculator__operator,
  .tip-calculator__results {
    width: 100%;
  }
}
</style>
