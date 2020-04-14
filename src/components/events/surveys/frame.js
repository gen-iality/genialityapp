export const dataFrame = {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: []
      }
    ]
  },
  options: {
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 1
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 1
          }
        }
      ]
    }
  }
};
