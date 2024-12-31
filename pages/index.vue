<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          title="Cotação do Dólar"
          subtitle="Dólar"
          variant="outlined"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dolar: [],
    };
  },
  async created() {
    await this.getDolar();
  },
  methods: {
    async getDolar() {
      try {
        const response = await this.$api.get("/USD-BRL");
        this.dolar = response;
        console.log('kick',this.items);
      } catch (error) {
        this.$toast.error(
          "Error"
        );
      }
    },
  },
};
</script>