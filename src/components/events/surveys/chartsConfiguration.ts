import { ChartConfiguration } from "chart.js";

export const COLORS_SETTINGS = {
  backgroundColor: [
    'rgba(31, 243, 210, 0.7)',
    'rgba(14, 28, 53, 0.7)',
    'rgba(28, 220, 183, 0.7)',
    'rgba(26, 186, 219, 0.7)',
    'rgba(24, 144, 255, 0.7)',
    'rgba(251, 11, 116, 0.7)',
    'rgba(64, 99, 132, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(128, 182, 244, 0.7)',
    'rgba(253, 208, 56, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
  ],
  borderColor: [
    'rgba(31, 243, 210, 1)',
    'rgba(14, 28, 53, 1)',
    'rgba(28, 220, 183, 1)',
    'rgba(26, 186, 219, 1)',
    'rgba(24, 144, 255, 1)',
    'rgba(251, 11, 116, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(128, 182, 244, 1)',
    'rgba(253, 208, 56, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ],
  borderWidth: 2,
  hoverBackgroundColor: [
    'rgba(31, 243, 210)',
    'rgba(14, 28, 53)',
    'rgba(28, 220, 183)',
    'rgba(26, 186, 219)',
    'rgba(24, 144, 255)',
    'rgba(251, 11, 116)',
    'rgba(255, 99, 132)',
    'rgba(128, 182, 244)',
    'rgba(253, 208, 56)',
    'rgba(54, 162, 235)',
    'rgba(255, 206, 86)',
    'rgba(75, 192, 192)',
    'rgba(153, 102, 255)',
    'rgba(255, 159, 64)',
  ],

  hoverBorderColor: [
    'rgba(31, 243, 210)',
    'rgba(14, 28, 53)',
    'rgba(28, 220, 183)',
    'rgba(26, 186, 219)',
    'rgba(24, 144, 255)',
    'rgba(251, 11, 116)',
    'rgba(255, 99, 132)',
    'rgba(128, 182, 244)',
    'rgba(253, 208, 56)',
    'rgba(54, 162, 235)',
    'rgba(255, 206, 86)',
    'rgba(75, 192, 192)',
    'rgba(153, 102, 255)',
    'rgba(255, 159, 64)',
  ],
}

export const VERTICAL_CHART_CONFIG: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: '# de Votos',
        ...COLORS_SETTINGS,
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuint',
    },
    scales: {

    },
    indexAxis: 'x',
  },
}

export const PIE_CHART_CONFIG: ChartConfiguration = {
  type: 'pie',
  data: {
    datasets: [
      {
        label: '# de Votos',
        ...COLORS_SETTINGS,
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuint',
    },
  },
}

export const HORIZONTAL_CHAR_CONFIG: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: '% de Votos',
        // labelColor: 'black',
        ...COLORS_SETTINGS,
        // ...alphabet,
        data: [],
      },
    ],
  },
  options: {
    // position: 'left',
    // title: {
    //   fontSize: 16,
    //   display: true,
    //   text: '',
    // },
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuint',
    },
    // legend: {
    //   labels: {
    //     fontColor: 'black',
    //   },
    // },
    // scales: {
    //   x: [
    //     {
    //       ticks: {
    //         beginAtZero: true,
    //         stepSize: 1,
    //         fontSize: 14,
    //         fontColor: 'black',
    //         fontStyle: 'bold',
    //       },
    //     },
    //   ],
    //   y: [
    //     {
    //       ticks: {
    //         display: false,
    //         beginAtZero: true,
    //         stepSize: 1,
    //         fontSize: 14,
    //         fontColor: 'black',
    //         fontStyle: 'bold',
    //       },
    //     },
    //   ],
    // },
    indexAxis: 'y',
  },
}

export const CHART_TYPE = {
  horizontal: HORIZONTAL_CHAR_CONFIG,
  pie: PIE_CHART_CONFIG,
  vertical: VERTICAL_CHART_CONFIG,
}

export const ALPHABET = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]