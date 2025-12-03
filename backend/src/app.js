const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use("/auth", require("./routes/authRoute"));
app.use("/users", require("./routes/userRoute"));
app.use("/categories", require("./routes/categoryRoute"));
app.use("/transactions", require("./routes/transactionRoute"));
app.use("/budgets", require("./routes/budgetRoute"));
app.use("/warnings", require("./routes/warningRoute"));



module.exports = app;
