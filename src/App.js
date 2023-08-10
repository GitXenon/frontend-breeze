import React, { useState, useEffect, useRef } from 'react';
import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js"
import './App.css';

ChartJS.register(LinearScale, PointElement, LineElement);

const options = {
  scales: {
    x: {
      type: 'linear',
      position: 'bottom'
    },
    y: {
      beginAtZero: false,
      min: 400,
      max: 3500
    }
  }
}

function App() {
  const [co2Data, setCo2Data] = useState([]);
  const chartRef = useRef();
  const fetchData = async () => {
    try {
      const response = await fetch('https://sea-turtle-app-tr8qq.ondigitalocean.app/');
      const json = await response.json();

      const newPoint = {
        x: new Date().valueOf(), // Use current time as x coordinate
        y: json.ppm
      };

      console.log(newPoint)

      setCo2Data(prevData => [...prevData, newPoint]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    datasets: [{
      label: 'Good Air Quality',
      data: co2Data,
      backgroundColor: value => {
        if (value.parsed?.y <= 1000) {
          return '#99FF00'
        }
        else if (value.parsed?.y <= 2000) {
          return '#FFCC00'
        }
        else {
          return '#CC0000'
        }
      }
    }],
  };

  return (
      <div className="chart-container">
        <h1>CO2 measurements</h1>
        <div className="chart-wrapper">
          <Scatter ref={chartRef} options={options} data={chartData} />
        </div>
      </div>
  );
}

export default App;
