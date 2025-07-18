const adminRouter = require("./admin.router");
const slugRouter = require("./slug.router");
const metaRouter = require("./meta.router");
const circulerRouter = require("./circuler.router");
const schoolRouter = require("./school.router");
const departmentRouter = require("./department.router");
const facultyRouter = require("./faculty.router");
const staticPageRouter = require("./staticPage.router");
const announcementRouter = require("./announcements.router");
const highlightBannerRouter = require("./highlight-banner.router");
const componentRouter = require('./components.router')
module.exports = {
  adminRouter,
  slugRouter,
  metaRouter,
  circulerRouter,
  schoolRouter,
  departmentRouter,
  facultyRouter,
  staticPageRouter,
  announcementRouter,
  highlightBannerRouter,
  componentRouter
};
