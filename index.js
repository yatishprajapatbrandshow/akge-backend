const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // To parse JSON request bodies
app.use(express.json()); // To parse JSON request bodies

// Import Routers
const {
  adminRouter,
  slugRouter,
  metaRouter,
  newsAndEventsRouter,
  schoolRouter,
  departmentRouter,
  facultyRouter,
  staticPageRouter,
} = require("./routes");

// Admin Router
app.use("/api/auth", adminRouter);

// Slug Router
app.use("/api/slug", slugRouter);

// Slug Router
app.use("/api/meta", metaRouter);

// Slug Router
app.use("/api/news-and-event", newsAndEventsRouter);  

// Slug Router
app.use("/api/school", schoolRouter);

app.use("/api/department", departmentRouter);
//
app.use("/api/faculty", facultyRouter);
// Static page
app.use("/api/static-page", staticPageRouter);

// Start the server
app.listen(PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
