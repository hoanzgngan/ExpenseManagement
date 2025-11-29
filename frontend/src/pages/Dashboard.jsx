import { useState, useEffect } from "react";
import "./Dashboard.css";

const API_URL = "http://localhost:3000";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalBudgets: 0,
    totalCategories: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [transRes, budgetRes, catRes, userRes] = await Promise.all([
          fetch(`${API_URL}/transactions`, { headers }),
          fetch(`${API_URL}/budgets`, { headers }),
          fetch(`${API_URL}/categories`, { headers }),
          fetch(`${API_URL}/users`, { headers }),
        ]);

        const transactions = await transRes.json();
        const budgets = await budgetRes.json();
        const categories = await catRes.json();
        const users = await userRes.json();

        setStats({
          totalTransactions: Array.isArray(transactions) ? transactions.length : 0,
          totalBudgets: Array.isArray(budgets) ? budgets.length : 0,
          totalCategories: Array.isArray(categories) ? categories.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
        });
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {error && <p className="error-message">{error}</p>}
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-number">{stats.totalTransactions}</p>
        </div>
        <div className="stat-card">
          <h3>Total Budgets</h3>
          <p className="stat-number">{stats.totalBudgets}</p>
        </div>
        <div className="stat-card">
          <h3>Total Categories</h3>
          <p className="stat-number">{stats.totalCategories}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="welcome-section">
        <h2>Welcome back!</h2>
        <p>Manage your expenses efficiently with our expense management system.</p>
      </div>
    </div>
  );
}
