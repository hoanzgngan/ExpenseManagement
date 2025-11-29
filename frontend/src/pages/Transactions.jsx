import { useState, useEffect } from "react";
import "./Transactions.css";

const API_URL = "http://localhost:3000";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!formData.amount || !formData.category || !formData.description) {
      setError("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          amount: "",
          category: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });
        setError("");
        fetchTransactions();
      } else {
        setError("Failed to add transaction");
      }
    } catch (err) {
      setError("Error adding transaction");
      console.error(err);
    }
  };

  if (loading) return <div className="transactions-container"><p>Loading...</p></div>;

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="add-transaction-section">
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Amount"
          className="trans-input"
        />
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Category"
          className="trans-input"
        />
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          className="trans-input"
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="trans-input"
        />
        <button onClick={handleAddTransaction} className="add-btn">Add Transaction</button>
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p className="empty-message">No transactions found.</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trans) => (
                <tr key={trans.id}>
                  <td>${trans.amount}</td>
                  <td>{trans.category}</td>
                  <td>{trans.description}</td>
                  <td>{new Date(trans.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
