<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          title="Cotação de Moedas"
          subtitle="Dólar"
          variant="outlined"
        >
          <v-card-text>
            <p style="font-weight: bold; color: white;">
              Dólar: {{ formatMoney(dolar.bid) }}
            </p>
            <p style="font-weight: bold; color: white;">
              Euro: {{ formatMoney(euro.bid) }}
            </p>
            <!-- <p style="font-weight: bold; color: white;">
              Bitcoin: {{ bitcoin.bid }}
            </p> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dolar: {},
      euro: {},
      bitcoin: null,
    };
  },

  async created() {
    await this.getDolar();
    await this.getEuro();
    await this.getBitcoin();
  },

  methods: {
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
        this.euro = response.EURBRL;
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