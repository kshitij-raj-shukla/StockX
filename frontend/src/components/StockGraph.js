import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/StockGraph.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockGraph = ({ historicalData }) => {
    const data = {
        labels: historicalData.map((data) => new Date(data.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Stock Price',
                data: historicalData.map((data) => data.close),
                borderColor: '#00d1b2',
                backgroundColor: 'rgba(0, 209, 178, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#fff',
                },
            },
            title: {
                display: true,
                text: 'Stock Price History (Last 30 Days)',
                color: '#fff',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#fff',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            y: {
                ticks: {
                    color: '#fff',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    };

    return (
        <div className="stock-graph-container">
            <Line data={data} options={options} />
        </div>
    );
};

export default StockGraph;