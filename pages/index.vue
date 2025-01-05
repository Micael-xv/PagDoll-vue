<template>
  <v-app style="background-color: #fefefe;">
    <v-container>
      <v-row>
        <v-col>
          <h1 class="d-flex justify-center" style="color: #000;">Cotação atualizada a cada 30 segundos</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn color="green" variant="outlined" @click="updated">
            Atualizar
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card
            title="Cotação de Moedas"
            subtitle="Real"
          >
            <v-card-text>
              <v-row>
                <v-col>
                  <v-autocomplete
                    v-model="selectedCurrency"
                    clearable
                    variant="outlined"
                    label="Selecione uma moeda"
                    :items="['Dólar para Real', 'Euro para Real', 'Bitcoin para Real', 'Bitcoin para Dólar', 'Real para Dólar', 'Real para Bitcoin', 'Real para Euro']"
                    @change="updateCotacao"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="amount"
                    variant="outlined"
                    label="Adicione um valor"
                    @input="calculateTotal"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols=2>
                  <p class="mt-2">Total R$: </p>
                </v-col>
                <v-col>
                  <v-text-field
                    readonly
                    :value="total"
                    variant="solo"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            title="Cotação de Moedas"
            subtitle="Real"
          >
            <v-card-text>
              <p style="font-weight: bold;">
                Dólar: R$ {{ formatMoney(dolar.bid) }}
              </p>
              <p style="font-weight: bold;">
                Euro: R$ {{ formatMoney(euro.bid) }}
              </p>
              <p style="font-weight: bold;">
                Bitcoin: USD {{ formatMoney(bitcoin.bid) }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      dolar: {},
      euro: {},
      bitcoin: {},
      selectedCurrency: '',
      amount: null,
      total: null,
    };
  },

  async created() {
    await this.getDolar();
    await this.getEuro();
    await this.getBitcoin();
    this.setTimeout();
  },

  methods: {
    async updated() {
      await this.getDolar();
      await this.getEuro();
      await this.getBitcoin();
      this.$toast.success('Cotações atualizadas com sucesso!');
    },

    setTimeout() {
      setTimeout(() => {
        this.updateRecurring();
      }, 30000);
    },

    async updateRecurring() {
      await this.getEuro();
      await this.getBitcoin();
      await this.getDolar();
      this.setTimeout();
    },

    async getDolar() {
      try {
        const response = await this.$api.get("/USD-BRL");
        this.dolar = response.USDBRL;
      } catch (error) {
        console.error('Erro ao buscar cotação do dólar', error);
      }
    },

    async getEuro() {
      try {
        const response = await this.$api.get("/EUR-BRL");
        this.euro = response.EURBRL;
      } catch (error) {
        console.error('Erro ao buscar cotação do euro', error);
      }
    },

    async getBitcoin() {
      try {
        const response = await this.$api.get("/BTC-USD");
        this.bitcoin = response.BTCUSD;
      } catch (error) {
        console.error('Erro ao buscar cotação do bitcoin', error);
      }
    },

    formatMoney(value) {
      if (value && !isNaN(value)) {
        return parseFloat(value).toFixed(2);
      }
      return 'Carregando...';
    },

    updateCotacao() {
      this.calculateTotal();
    },

    calculateTotal() {
      if (!this.amount || !this.selectedCurrency) {
        this.total = null;
        return;
      }
      
      let rate;
      if (this.selectedCurrency === 'Dólar para Real') {
        rate = this.dolar.bid;
      } else if (this.selectedCurrency === 'Euro para Real') {
        rate = this.euro.bid;
      } else if (this.selectedCurrency === 'Bitcoin para Real') {
        rate = this.bitcoin.bid * this.dolar.bid;
      } else if (this.selectedCurrency === 'Bitcoin para Dólar') {
        rate = this.bitcoin.bid;
      } else if (this.selectedCurrency === 'Real para Dólar') {
        rate = 1 / this.dolar.bid;
        } else if (this.selectedCurrency === 'Real para Bitcoin') {
        rate = 1 / (this.bitcoin.bid * this.dolar.bid);
      } else if (this.selectedCurrency === 'Real para Euro') {
        rate = 1 / this.euro.bid;
      }

      if (rate) {
        this.total = this.amount * rate;
      }
    },
  },
};
</script>