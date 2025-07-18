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
  highlightBannerRouter,
  componentRouter,
  extraParamsDataRouter,
  editPathRouter
} = require("./routes");

app.get('/health-check', (req, res) => {
  res.status(200).send("Everything Is Fine " + Date.now())
})

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
app.use("/api/highlight-banner", highlightBannerRouter);

// static-page page
app.use("/api/components", componentRouter);

// static-page page
app.use("/api/extra-component-data", extraParamsDataRouter);
// Edit Path Router
app.use("/api/edit-path", editPathRouter);

// Start the server
app.listen(PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
