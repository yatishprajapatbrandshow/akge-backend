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
  schoolRouter,
  departmentRouter,
  facultyRouter,
  staticPageRouter,
  circulerRouter,
  announcementRouter,
} = require("./routes");

// Admin Router
app.use("/api/auth", adminRouter);

// meta Router
app.use("/api/slug", slugRouter);

// meta Router
app.use("/api/meta", metaRouter);

//Circuler Router
app.use("/api/circuler", circulerRouter);

// school Router
app.use("/api/school", schoolRouter);

// department Router
app.use("/api/department", departmentRouter);

// faculty Router
app.use("/api/faculty", facultyRouter);

// static-page page
app.use("/api/static-page", staticPageRouter);
 
// static-page page
app.use("/api/announcement", announcementRouter);

// static-page page
app.use("/api/highlight-banner", announcementRouter);

// Start the server
app.listen(PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
