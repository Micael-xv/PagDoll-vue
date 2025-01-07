<template>
  <v-card outlined>
    <v-row>
      <v-col>
        <v-card-title class="font-weight-bold">
          Variação do Dólar (últimos {{ numero_dias }} dias)
        </v-card-title>
      </v-col>
      <v-col cols="3">
        <v-autocomplete
          v-model="numero_dias"
          class="mr-3 mt-3"
          density="compact"
          variant="outlined"
          label="Selecione o período"
          :items="periodos"
          item-title="text"
          item-value="value"
          @change="fetchChartData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card-text class="mt-n4">
          <canvas ref="chartCanvas" />
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";
import axios from "axios";

// Registrar todos os componentes necessários do Chart.js
Chart.register(...registerables);

const chartCanvas = ref(null);
const chartInstance = ref(null);

// Definir os períodos (para exibir no autocomplete)
const periodos = [
  { text: "7 dias", value: 7 },
  { text: "15 dias", value: 15 },
  { text: "30 dias", value: 30 },
  { text: "45 dias", value: 45 },
  { text: "60 dias", value: 60 },
  { text: "90 dias", value: 90 }
];

// Inicializar o número de dias com o valor padrão de 7
const numero_dias = ref(7); // O número de dias solicitado (máximo 90)

const fetchChartData = async () => {
  try {
    // Captura a posição de rolagem antes de atualizar os dados
    const scrollPosition = window.scrollY;

    // Requisição para buscar as cotações da API
    const response = await axios.get(
      `https://economia.awesomeapi.com.br/json/daily/USD-BRL/${numero_dias.value}`
    );

    // Processar os dados para obter os labels (datas) e os valores (high)
    const labels = response.data.map((item) => {
      const date = new Date(item.timestamp * 1000); // Converter timestamp para data
      return date.toLocaleDateString("pt-BR"); // Formatar a data no formato legível
    });
    const data = response.data.map((item) => parseFloat(item.high)); // Usar o valor "high" como exemplo

    // Se já existir uma instância do gráfico, destrói para criar um novo
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    // Criar ou atualizar o gráfico com os novos dados
    const ctx = chartCanvas.value.getContext("2d");
    chartInstance.value = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Dólar (BRL)",
            data: data,
            borderColor: "#42A5F5",
            backgroundColor: "rgba(66, 165, 245, 0.2)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return "R$ " + tooltipItem.raw.toFixed(2);
              },
            },
          },
        },
        scales: {
          x: {
            reverse: true,
          },
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (value) {
                return "R$ " + value.toFixed(2);
              },
            },
          },
        },
      },
    });

    window.scrollTo(0, scrollPosition);
  } catch (error) {
    console.error("Erro ao buscar os dados da API:", error);
  }
};

onMounted(() => {
  fetchChartData();
});

watch(numero_dias, () => {
  fetchChartData();
});
</script>

<style scoped>
.card-title {
  text-align: center;
  font-size: 1.25rem;
}
</style>
