import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchPrediction } from '../utils/api';
import '../styles/Prediction.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Prediction = () => {
    const [ticker, setTicker] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setData(null); // Reset previous data
        try {
            const response = await fetchPrediction(ticker.toUpperCase());
            setData(response);
        } catch (err) {
            setError('Invalid ticker or server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const chartData = data
        ? {
              labels: [...data.historical_dates, ...data.predicted_dates],
              datasets: [
                  {
                      label: 'Historical Prices',
                      data: [...data.historical_prices, ...Array(7).fill(null)],
                      borderColor: 'var(--chart-historical)', // Use CSS variable for color
                      backgroundColor: 'var(--chart-historical)', // For points
                      pointRadius: 4,
                      pointHoverRadius: 6,
                      fill: false,
                      tension: 0.3, // Smooth curve
                  },
                  {
                      label: 'Predicted Prices',
                      data: [...Array(data.historical_prices.length).fill(null), ...data.predicted_prices],
                      borderColor: 'var(--chart-predicted)', // Use CSS variable for color
                      backgroundColor: 'var(--chart-predicted)', // For points
                      pointRadius: 4,
                      pointHoverRadius: 6,
                      fill: false,
                      borderDash: [5, 5],
                      tension: 0.3, // Smooth curve
                  },
              ],
          }
        : null;

    return (
        <div className="prediction-container">
            {/* Header Section */}
            <header className="prediction-header">
                <h1 className="prediction-title">Stock Price Prediction</h1>
                <p className="prediction-description">
                    Enter a stock ticker to visualize historical prices and predict future trends using advanced machine learning models.
                </p>
            </header>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="prediction-form">
                <div className="input-group">
                    <input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        placeholder="Enter stock ticker (e.g., AAPL)"
                        className="input-field"
                        required
                    />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        'Predict'
                    )}
                </button>
            </form>

            {/* Error Message */}
            {error && <p className="error-text">{error}</p>}

            {/* Chart and Metadata Section */}
            {data && (
                <div className="prediction-result">
                    <div className="chart-container">
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            color: 'var(--text-color)', // Use theme text color
                                            font: { size: 14, weight: '500' },
                                        },
                                    },
                                    title: {
                                        display: true,
                                        text: `${ticker.toUpperCase()} Price Prediction`,
                                        color: 'var(--text-color)',
                                        font: { size: 20, weight: '700' },
                                        padding: { top: 10, bottom: 20 },
                                    },
                                    tooltip: {
                                        backgroundColor: 'var(--card-background)',
                                        titleColor: 'var(--text-color)',
                                        bodyColor: 'var(--text-color)',
                                        borderColor: 'var(--border-color)',
                                        borderWidth: 1,
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Date',
                                            color: 'var(--text-color)',
                                            font: { size: 14, weight: '500' },
                                        },
                                        ticks: {
                                            color: 'var(--text-color)',
                                            maxRotation: 45,
                                            minRotation: 45,
                                        },
                                        grid: {
                                            color: 'var(--border-color)',
                                            lineWidth: 0.5,
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Price (USD)',
                                            color: 'var(--text-color)',
                                            font: { size: 14, weight: '500' },
                                        },
                                        ticks: {
                                            color: 'var(--text-color)',
                                            callback: (value) => `$${value}`,
                                        },
                                        grid: {
                                            color: 'var(--border-color)',
                                            lineWidth: 0.5,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Metadata Section (Optional, based on API response) */}
                    {data.confidence && (
                        <div className="prediction-metadata">
                            <h3 className="metadata-title">Prediction Details</h3>
                            <p className="metadata-item">
                                <span>Confidence Level:</span> {(data.confidence * 100).toFixed(2)}%
                            </p>
                            <p className="metadata-item">
                                <span>Prediction Period:</span> Next 7 Days
                            </p>
                            <p className="metadata-note">
                                *Predictions are based on historical data and machine learning models. Past performance is not indicative of future results.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Prediction;