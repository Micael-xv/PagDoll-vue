<template>
  <v-app style="background-color: #f0f4f8">
    <v-container>
      <v-row class="mb-5">
        <v-col>
          <h1
            v-if="smAndUp"
            class="text-h4 text-center font-weight-bold"
            style="color: #333"
          >
            Cotação Atualizada a Cada 30 Segundos
          </h1>
          <h1
            v-if="smAndDown"
            class="text-h6 text-center font-weight-bold"
            style="color: #333"
          >
            Cotação Atualizada a Cada 30 Segundos
          </h1>
        </v-col>
      </v-row>

      <v-row class="mb-5">
        <v-col cols="12" md="8" class="mx-auto">
          <v-card outlined>
            <v-row>
              <v-col>
                <v-card-title class="font-weight-bold"
                  >Conversor de Moedas</v-card-title
                >
                <v-card-subtitle>Real</v-card-subtitle>
              </v-col>
              <v-col v-if="smAndUp" class="d-flex justify-end">
                <v-btn
                  icon="mdi-refresh"
                  color="success"
                  variant="elevated"
                  class="mr-2 mt-2"
                  @click="updated"
                >
                  <v-icon left>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="selectedCurrency"
                    clearable
                    variant="outlined"
                    label="Selecione uma moeda"
                    :items="[
                      'Dólar para Real',
                      'Euro para Real',
                      'Bitcoin para Real',
                      'Bitcoin para Dólar',
                      'Real para Dólar',
                      'Real para Bitcoin',
                      'Real para Euro',
                    ]"
                    @change="updateCotacao"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="amount"
                    variant="outlined"
                    label="Adicione um valor"
                    @input="calculateTotal"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="2" class="d-flex align-center mt-n4">
                  <p class="mt-n2 font-weight-bold">Total R$:</p>
                </v-col>
                <v-col cols="12" md="10">
                  <v-text-field readonly :value="total" variant="outlined" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="d-flx justify-center">
        <v-col cols="12" md="6">
          <v-card outlined class="mb-4">
            <v-card-title class="font-weight-bold"
              >Cotação de Moedas</v-card-title
            >
            <v-card-subtitle>Atualizações em Tempo Real</v-card-subtitle>
            <v-card-text>
              <p class="font-weight-bold">
                Dólar: R$ {{ formatMoney(dolar.bid) }}
              </p>
              <p class="font-weight-bold">
                Euro: R$ {{ formatMoney(euro.bid) }}
              </p>
              <p class="font-weight-bold">
                Bitcoin: USD {{ formatMoney(bitcoin.bid) }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <VariacaoDolarChart />
    </v-container>
    <v-container>
      <VariacaoEuroChart />
    </v-container>
    <v-container>
      <VariacaoBitcoinChart />
    </v-container>
  </v-app>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { smAndUp, smAndDown } = useDisplay();

useHead({
  title: `Conversor de Moedas`,
  meta: [
    {
      name: "description",
      content: "Conversor de Moedas",
    },
  ],
});
</script>

<script>
export default {
  data() {
    return {
      dolar: {},
      euro: {},
      bitcoin: {},
      selectedCurrency: "",
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
      this.$toast.success("Cotações atualizadas com sucesso!");
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
        console.error("Erro ao buscar cotação do dólar", error);
      }
    },

    async getEuro() {
      try {
        const response = await this.$api.get("/EUR-BRL");
        this.euro = response.EURBRL;
      } catch (error) {
        console.error("Erro ao buscar cotação do euro", error);
      }
    },

    async getBitcoin() {
      try {
        const response = await this.$api.get("/BTC-USD");
        this.bitcoin = response.BTCUSD;
      } catch (error) {
        console.error("Erro ao buscar cotação do bitcoin", error);
      }
    },

    formatMoney(value) {
      if (value && !isNaN(value)) {
        return parseFloat(value).toFixed(2);
      }
      return "Carregando...";
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
      if (this.selectedCurrency === "Dólar para Real") {
        rate = this.dolar.bid;
      } else if (this.selectedCurrency === "Euro para Real") {
        rate = this.euro.bid;
      } else if (this.selectedCurrency === "Bitcoin para Real") {
        rate = this.bitcoin.bid * this.dolar.bid;
      } else if (this.selectedCurrency === "Bitcoin para Dólar") {
        rate = this.bitcoin.bid;
      } else if (this.selectedCurrency === "Real para Dólar") {
        rate = 1 / this.dolar.bid;
      } else if (this.selectedCurrency === "Real para Bitcoin") {
        rate = 1 / (this.bitcoin.bid * this.dolar.bid);
      } else if (this.selectedCurrency === "Real para Euro") {
        rate = 1 / this.euro.bid;
      }

      if (rate) {
        this.total = this.amount * rate;
      }
    },
  },
};
</script>
