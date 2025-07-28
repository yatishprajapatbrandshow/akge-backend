const express = require("express");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
// Import Routers
const {
  adminRouter,
  slugRouter,
  metaRouter,
  schoolRouter,
  departmentRouter,
  facultyRouter,
  staticPageRouter,
  circularRouter,
  announcementRouter,
  highlightBannerRouter,
  componentRouter,
  extraParamsDataRouter,
  editPathRouter,
  newsDetailPageRouter,
  uploadRouter,
  dashboardRouter,
  widgetRouter
} = require("./routes");
const { userAuth } = require("./middlewares/auth");

// Connect to the database
connectDB();

app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser());


app.get('/health-check', (req, res) => {
  res.status(200).send("Everything Is Fine " + Date.now())
})

// Admin Router
app.use("/api/auth", adminRouter);

// meta Router
app.use("/api/slug", slugRouter);

// meta Router
app.use("/api/meta", userAuth, metaRouter);

//Circular Router
app.use("/api/circular", userAuth, circularRouter);

// school Router
app.use("/api/school", userAuth, schoolRouter);

// department Router
app.use("/api/department", userAuth, departmentRouter);

// faculty Router
app.use("/api/faculty", userAuth, facultyRouter);

// static-page page
app.use("/api/static-page", userAuth, staticPageRouter);

// static-page page
app.use("/api/announcement", userAuth, announcementRouter);

// static-page page
app.use("/api/highlight-banner", userAuth, highlightBannerRouter);

// static-page page
app.use("/api/components", userAuth, componentRouter);

// static-page page
app.use("/api/extra-component-data", userAuth, extraParamsDataRouter);
// Edit Path Router
app.use("/api/edit-path", userAuth, editPathRouter);
// Edit Path Router
app.use("/api/upload", userAuth, uploadRouter);

// News Detail Page Router
app.use("/api/list-detail-page", userAuth, newsDetailPageRouter);

// dashboard api router 
app.use("/api/dashboardData", userAuth, dashboardRouter)

// dashboard api router 
app.use("/api/widget", widgetRouter)

// Start the server
app.listen(PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
