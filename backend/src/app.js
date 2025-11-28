const express = require("express");
const app = express();

app.use(express.json());

app.use("/auth", require("./routes/authRoute"));
app.use("/users", require("./routes/userRoute"));
app.use("/categories", require("./routes/categoryRoute"));
app.use("/transactions", require("./routes/transactionRoute"));
app.use("/budgets", require("./routes/budgetRoute"));

module.exports = app;
