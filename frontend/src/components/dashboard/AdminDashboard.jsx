import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
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
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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
        const data = await api.get('/admin/dashboard', token);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use dummy data if API fails
        setStats({
          orders: 156,
          products: 89,
          revenue: 125000,
          customers: 234
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  // Dummy data for charts
  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 78000, 89000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const orderStatusData = {
    labels: ['Confirmed', 'Pending', 'Picked Up', 'Returned', 'Cancelled'],
    datasets: [
      {
        data: [45, 23, 18, 12, 8],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const productCategoryData = {
    labels: ['Cars', 'Bikes', 'Equipment', 'Electronics', 'Tools', 'Other'],
    datasets: [
      {
        label: 'Products',
        data: [25, 18, 15, 12, 10, 9],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(168, 85, 247)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const weeklyOrdersData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11,
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold">{stats?.orders || 156}</p>
              <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold">{stats?.products || 89}</p>
              <p className="text-green-100 text-xs mt-1">+5% from last month</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">₹{(stats?.revenue || 125000).toLocaleString()}</p>
              <p className="text-purple-100 text-xs mt-1">+18% from last month</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold">{stats?.customers || 234}</p>
              <p className="text-orange-100 text-xs mt-1">+8% from last month</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h3>
          <div className="h-80">
            <Line data={monthlyRevenueData} options={chartOptions} />
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <Doughnut data={orderStatusData} options={doughnutOptions} />
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Products by Category</h3>
          <div className="h-80">
            <Bar data={productCategoryData} options={chartOptions} />
          </div>
        </div>

        {/* Weekly Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Orders</h3>
          <div className="h-80">
            <Bar data={weeklyOrdersData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { type: 'order', message: 'New order #1234 confirmed', time: '2 minutes ago', color: 'green' },
            { type: 'product', message: 'Product "Luxury Car" added', time: '15 minutes ago', color: 'blue' },
            { type: 'payment', message: 'Payment received for order #1230', time: '1 hour ago', color: 'purple' },
            { type: 'return', message: 'Order #1228 marked as returned', time: '2 hours ago', color: 'orange' },
            { type: 'customer', message: 'New customer registered', time: '3 hours ago', color: 'indigo' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full bg-${activity.color}-500`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


