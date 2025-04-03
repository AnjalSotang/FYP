import { useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export function WorkoutProgressChart({ history, metric = "performance" }) {
  const chartRef = useRef(null)

  // Define chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              if (metric === "performance") {
                label += context.parsed.y + "%"
              } else if (metric === "duration") {
                label += context.parsed.y + " min"
              } else {
                label += context.parsed.y ? "Completed" : "Missed"
              }
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          callback: (value) => {
            if (metric === "performance") {
              return value + "%"
            } else if (metric === "duration") {
              return value + " min"
            }
            return value
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  }

  // If no data is provided, use sample data
  const chartData =
    history.length > 0
      ? history
      : [
          {
            date: "Day 1",
            completed: true,
            duration: 45,
            performance: 85,
          },
          {
            date: "Day 2",
            completed: true,
            duration: 50,
            performance: 87,
          },
          {
            date: "Day 3",
            completed: false,
            duration: 0,
            performance: 0,
          },
          {
            date: "Day 4",
            completed: true,
            duration: 55,
            performance: 90,
          },
          {
            date: "Day 5",
            completed: true,
            duration: 60,
            performance: 92,
          },
        ]

  // Prepare data based on selected metric
  const labels = chartData.map((item) => item.date)
  let dataValues = []
  let backgroundColor = ""
  let borderColor = ""

  switch (metric) {
    case "performance":
      dataValues = chartData.map((item) => (item.completed ? item.performance : null))
      backgroundColor = "rgba(132, 204, 22, 0.2)"
      borderColor = "rgb(132, 204, 22)"
      break
    case "duration":
      dataValues = chartData.map((item) => item.duration)
      backgroundColor = "rgba(56, 189, 248, 0.2)"
      borderColor = "rgb(56, 189, 248)"
      break
    case "completion":
      dataValues = chartData.map((item) => (item.completed ? 1 : 0))
      backgroundColor = "rgba(249, 115, 22, 0.2)"
      borderColor = "rgb(249, 115, 22)"
      break
  }

  const chartDataConfig = {
    labels,
    datasets: [
      {
        label: metric.charAt(0).toUpperCase() + metric.slice(1),
        data: dataValues,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: borderColor,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  return <Line ref={chartRef} options={options} data={chartDataConfig} />
}