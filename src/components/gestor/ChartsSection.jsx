import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function BarChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Artefato de mov.", "Posicionamento", "Exposição", "Equipamento", "Paciente"],
        datasets: [
          {
            label: "Qtd. Rejeições",
            data: [42, 30, 18, 12, 8],
            backgroundColor: ["#EF4444", "#F97316", "#EAB308", "#3B82F6", "#6366F1"],
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#F3F4F6" },
            ticks: { color: "#9CA3AF", font: { size: 11 } },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#6B7280", font: { size: 11 } },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  return <canvas ref={canvasRef} />;
}

function DonutChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Raio-X", "Ultrassom", "Tomografia", "Ressonância"],
        datasets: [
          {
            data: [38, 52, 68, 94],
            backgroundColor: ["#3B82F6", "#10B981", "#F97316", "#8B5CF6"],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#6B7280", font: { size: 11 }, padding: 12, usePointStyle: true },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Gráfico de Barras */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 text-sm">Motivos de Rejeição de Imagem</h3>
          <p className="text-xs text-gray-400 mt-0.5">Mês atual · Total: 110 rejeições</p>
        </div>
        <div className="h-56">
          <BarChart />
        </div>
      </div>

      {/* Gráfico de Rosca */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 text-sm">TAT Médio por Modalidade (min)</h3>
          <p className="text-xs text-gray-400 mt-0.5">Tempo médio de laudo · Mês atual</p>
        </div>
        <div className="h-56">
          <DonutChart />
        </div>
      </div>
    </div>
  );
}