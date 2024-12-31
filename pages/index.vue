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
            <p style="font-weight: bold; color: white;">Compra: {{ dolar.bid }}</p>
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
    };
  },

  async created() {
    await this.getDolar();
  },

  methods: {
    async getDolar() {
      try {
        const response = await this.$api.get("/USD-BRL");
        this.dolar = response.USDBRL;
        console.log('kick',this.dolar);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>