import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { CHART_TYPE } from './chartsConfiguration';

interface Props {
	id?: string
	labels: string[];
	dataValues: number[];
	type: 'horizontal' | 'vertical' | 'pie';
	isMobile: boolean;
}

export default function ChartRender(props: Props) {
	const { dataValues, isMobile, labels, type } = props;
	const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
	const [chartInstance, setChartInstance] = useState<Chart | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (canvasRef) {
			setCanvasElement(canvasRef.current);
		}
	}, [canvasRef]);

	useEffect(() => {
		if (canvasElement) {
			const chartInstance = new Chart(canvasElement, CHART_TYPE[type]);
			setChartInstance(chartInstance);
		}
	}, [canvasElement]);

	useEffect(() => {
		// console.log({ dataValues, isMobile, labels });
		updateChart();
	}, [dataValues, isMobile, labels]);

	useEffect(() => {
		// console.log({ dataValues, isMobile, labels });
		updateChart();
	}, []);

	const updateChart = () => {
		if (chartInstance) {
			chartInstance.data.labels = labels;
			chartInstance.data.datasets[0].data = dataValues;
			chartInstance.options = {
				responsive: isMobile,
				plugins: {
					datalabels: {
						color: '#333',
						formatter: (value, context) => {
							return context.chart.data.labels;
							// return context.chart.data.labels[context.dataIndex];
						},
						textAlign: 'left',
						anchor: 'start',
						align: 5,
						font: {
							size: isMobile ? 12 : 22, // otorga el tamaño de la fuente en los resultados de la encuesta segun el dispositivo
						},
					},
					legend: {
						display: true,
						labels: {
							font: {
								size: isMobile ? 12 : 18,
								family: "'Montserrat', sans-serif", // para probar si afecta la fuente cambiar Montserrat por Papyrus
							},
						},
						maxWidth: 250,
						position: isMobile ? 'top' : 'left',
					},
				},
				indexAxis: type === 'horizontal' ? 'y' : 'x',
			};
			chartInstance.update();
		}
	};

	return <canvas className='chart-render' ref={canvasRef} id={props.id ? `chart-render-${props.id}` : 'chart-render'} />;
}
