import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../services/api.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get("/admin/dashboard", token);
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Dummy fallback stats
        setStats({
          orders: 156,
          products: 89,
          revenue: 125000,
          customers: 234,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  // ✅ Chart Data
  const monthlyRevenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [12000, 15000, 10000, 18000, 22000, 25000],
        borderColor: "#ff6600",
        backgroundColor: "rgba(255,102,0,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const orderStatusData = {
    labels: ["Confirmed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [45, 23, 8],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const productCategoryData = {
    labels: ["Cars", "Bikes", "Equipment", "Electronics", "Other"],
    datasets: [
      {
        label: "Products",
        data: [25, 18, 15, 12, 9],
        backgroundColor: [
          "#ff6600",
          "#f59e0b",
          "#10b981",
          "#3b82f6",
          "#6b7280",
        ],
        borderWidth: 2,
      },
    ],
  };

  const weeklyOrdersData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: "rgba(255,102,0,0.85)",
        borderColor: "#ff6600",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true, padding: 20, font: { size: 13 } },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { font: { size: 12 } } },
      x: { ticks: { font: { size: 12 } } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 20, font: { size: 12 } },
      },
    },
  };

  if (loading) {
    return (
      <div style={loaderWrapper}>
        <div style={loader}></div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "24px", padding: "24px", background: "#f9fafb" }}>
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px" }}>
        <div style={cardStyle("#ff6600")}>
          <p style={cardLabel}>Total Orders</p>
          <h2 style={cardValue}>{stats?.orders}</h2>
        </div>
        <div style={cardStyle("#10b981")}>
          <p style={cardLabel}>Total Products</p>
          <h2 style={cardValue}>{stats?.products}</h2>
        </div>
        <div style={cardStyle("#3b82f6")}>
          <p style={cardLabel}>Total Revenue</p>
          <h2 style={cardValue}>₹{stats?.revenue.toLocaleString()}</h2>
        </div>
        <div style={cardStyle("#f59e0b")}>
          <p style={cardLabel}>Total Customers</p>
          <h2 style={cardValue}>5</h2>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "24px" }}>
        <div style={chartCard}>
          <h3 style={chartTitle}>📈 Monthly Revenue Trend</h3>
          <div style={{ height: "300px" }}>
            <Line data={monthlyRevenueData} options={chartOptions} />
          </div>
        </div>

        <div style={chartCard}>
          <h3 style={chartTitle}>📊 Order Status Distribution</h3>
          <div style={{ height: "300px" }}>
            <Doughnut data={orderStatusData} options={doughnutOptions} />
          </div>
        </div>

        <div style={chartCard}>
          <h3 style={chartTitle}>📦 Products by Category</h3>
          <div style={{ height: "300px" }}>
            <Bar data={productCategoryData} options={chartOptions} />
          </div>
        </div>

        <div style={chartCard}>
          <h3 style={chartTitle}>🗓 Weekly Orders</h3>
          <div style={{ height: "300px" }}>
            <Bar data={weeklyOrdersData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={chartCard}>
        <h3 style={chartTitle}>🔔 Recent Activity</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={activityItem}>
            <span style={{ fontWeight: "600", color: "#ff6600" }}>Order #1234</span> confirmed
          </li>
          <li style={activityItem}>
            <span style={{ fontWeight: "600", color: "#10b981" }}>Product "Honda Civic"</span> added
          </li>
          <li style={activityItem}>
            <span style={{ fontWeight: "600", color: "#f59e0b" }}>Payment of ₹5,000</span> received
          </li>
          <li style={activityItem}>
            <span style={{ fontWeight: "600", color: "#3b82f6" }}>Report generated</span> for August
          </li>
        </ul>
      </div>
    </div>
  );
}

// 🎨 Inline Styles

const loaderWrapper = { display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" };
const loader = {
  border: "5px solid #f3f3f3",
  borderTop: "5px solid #ff6600",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  animation: "spin 1s linear infinite",
};

const cardStyle = (color) => ({
  background: color,
  color: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
  textAlign: "center",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
  fontFamily: "Segoe UI, sans-serif",
});

const cardLabel = { fontSize: "14px", opacity: 0.9, marginBottom: "8px" };
const cardValue = { fontSize: "26px", fontWeight: "700", margin: 0 };

const chartCard = {
  background: "#fff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease",
};

const chartTitle = {
  fontSize: "17px",
  fontWeight: "600",
  marginBottom: "14px",
  color: "#333",
};

const activityItem = {
  padding: "12px 0",
  borderBottom: "1px solid #eee",
  fontSize: "15px",
  transition: "background 0.2s ease",
};