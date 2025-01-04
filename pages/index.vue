<template>
  <v-app style="background-color: #fefefe;">
    <v-container>
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
                  <v-text-field
                  />
                </v-col>
                <v-col>
                  <v-text-field
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
        console.error(error);
      }
    },

    async getEuro() {
      try {
        const response = await this.$api.get("/EUR-BRL");
        this.euro = response.EURBRL;
      } catch (error) {
        console.error(error);
      }
    },

    async getBitcoin() {
      try {
        const response = await this.$api.get("/BTC-USD");
        this.bitcoin = response.BTCUSD;
      } catch (error) {
        console.error(error);
      }
    },

    formatMoney(value) {
      if (value && !isNaN(value)) {
        return parseFloat(value).toFixed(2);
      }
      return 'Carregando...';
    },
  },
};
</script>