const colorBars = {
   backgroundColor: [
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
      'rgba(255, 99, 132)',
      'rgba(128, 182, 244)',
      'rgba(253, 208, 56)',
      'rgba(54, 162, 235)',
      'rgba(255, 206, 86)',
      'rgba(75, 192, 192)',
      'rgba(153, 102, 255)',
      'rgba(255, 159, 64)',
   ],
};

export const graphicsFrame = {
   horizontalBar: {
      type: 'bar',
      data: {
         labels: [],
         datasets: [
            {
               label: '% de Votos',
               labelColor: 'black',
               ...colorBars,
               data: [],
            },
         ],
      },
      options: {
         title: {
            fontSize: 16,
            display: true,
            text: '',
         },
         responsive: true,
         animation: {
            duration: 2000,
            easing: 'easeInOutQuint',
         },
         legend: {
            labels: {
               fontColor: 'black',
            },
         },
         scales: {
            x: [
               {
                  ticks: {
                     beginAtZero: true,
                     stepSize: 1,
                     fontSize: 14,
                     fontColor: 'black',
                     fontStyle: 'bold',
                  },
               },
            ],
            y: [
               {
                  ticks: {
                     display: false,
                     beginAtZero: true,
                     stepSize: 1,
                     fontSize: 14,
                     fontColor: 'black',
                     fontStyle: 'bold',
                  },
               },
            ],
         },
      },
      indexAxis: 'y',
   },
   verticalBar: {
      type: 'bar',
      data: {
         labels: [],
         datasets: [
            {
               label: '# de Votos',
               labelColor: 'black',
               ...colorBars,
               data: [],
            },
         ],
      },
      options: {
         title: {
            fontSize: 16,
            display: true,
            text: '',
         },
         responsive: true,
         animation: {
            duration: 2000,
            easing: 'easeInOutQuint',
         },
         legend: {
            labels: {
               fontColor: 'white',
            },
         },
         scales: {
            x: [
               {
                  ticks: {
                     beginAtZero: true,
                     stepSize: 1,
                     fontSize: 14,
                     fontColor: 'white',
                     fontStyle: 'bold',
                  },
               },
            ],
            y: [
               {
                  ticks: {
                     beginAtZero: true,
                     stepSize: 1,
                     fontSize: 14,
                     fontColor: 'white',
                     fontStyle: 'bold',
                  },
               },
            ],
         },
         indexAxis: 'x',
      },
   },
   ChartPie: {
      type: 'pie',
      data: {
         labels: [],
         datasets: [
            {
               label: '# de Votos',
               labelColor: 'black',
               ...colorBars,
               data: [],
            },
         ],
      },
      options: {
         title: {
            fontSize: 16,
            display: true,
            text: '',
         },
         responsive: true,
         animation: {
            duration: 2000,
            easing: 'easeInOutQuint',
         },
         legend: {
            labels: {
               fontColor: 'black',
            },
         },
      },
   },
};
