import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">ExpenseManager</div>
        <ul className="navbar-menu">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><a href="/transactions">Transactions</a></li>
          <li><a href="/budgets">Budgets</a></li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
}
