import { useState, useEffect } from "react";
import "./Categories.css";

const API_URL = "http://localhost:3000";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Please enter a category name");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        setNewCategory("");
        setError("");
        fetchCategories();
      } else {
        setError("Failed to add category");
      }
    } catch (err) {
      setError("Error adding category");
      console.error(err);
    }
  };

  if (loading) return <div className="categories-container"><p>Loading...</p></div>;

  return (
    <div className="categories-container">
      <h1>Categories</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="add-category-section">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="category-input"
        />
        <button onClick={handleAddCategory} className="add-btn">Add Category</button>
      </div>

      <div className="categories-list">
        {categories.length === 0 ? (
          <p className="empty-message">No categories found. Create one!</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="category-item">
              <span>{cat.name}</span>
              <small>{new Date(cat.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
