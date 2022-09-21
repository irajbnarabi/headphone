import { Line } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';

function LineChart({ labels, data, chartLabel }) {
	const [config, setConfigs] = useState(null);

	useEffect(() => {
		if (data) {
			setConfigs({
				labels: labels,
				datasets: [
					{
						label: chartLabel,
						fill: false,
						lineTension: 0.1,
						backgroundColor: 'rgba(75,192,192,0.4)',
						borderColor: 'rgba(75,192,192,1)',
						borderCapStyle: 'butt',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: 'rgba(75,192,192,1)',
						pointBackgroundColor: '#FFF',
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: 'rgba(75,192,192,1)',
						pointHoverBorderColor: 'rgba(220,220,220,1)',
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
						data: data,
					},
				],
			});
		} else {
			data = [];
		}
	}, [data]);

	if (config) {
		return (
			<Line
				data={config}
				width={500}
				height={300}
				options={{
					maintainAspectRatio: false,
				}}
			/>
		);
	}

	return null;
}

export default LineChart;
