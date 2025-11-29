import { useState, useEffect } from "react";
import "./Budgets.css";

const API_URL = "http://localhost:3000";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/budgets`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load budgets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    if (!formData.category || !formData.amount) {
      setError("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/budgets`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          category: "",
          amount: "",
          period: "monthly",
        });
        setError("");
        fetchBudgets();
      } else {
        setError("Failed to add budget");
      }
    } catch (err) {
      setError("Error adding budget");
      console.error(err);
    }
  };

  if (loading) return <div className="budgets-container"><p>Loading...</p></div>;

  return (
    <div className="budgets-container">
      <h1>Budgets</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="add-budget-section">
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Category"
          className="budget-input"
        />
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Amount"
          className="budget-input"
        />
        <select
          value={formData.period}
          onChange={(e) => setFormData({ ...formData, period: e.target.value })}
          className="budget-input"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button onClick={handleAddBudget} className="add-btn">Add Budget</button>
      </div>

      <div className="budgets-list">
        {budgets.length === 0 ? (
          <p className="empty-message">No budgets found. Create one!</p>
        ) : (
          budgets.map((budget) => (
            <div key={budget.id} className="budget-card">
              <div className="budget-header">
                <h3>{budget.category}</h3>
                <span className="period-badge">{budget.period}</span>
              </div>
              <div className="budget-details">
                <p className="amount">${budget.amount}</p>
                <small>{new Date(budget.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="budget-bar">
                <div className="budget-progress" style={{ width: "45%" }}></div>
              </div>
              <small className="budget-info">45% of budget used</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
