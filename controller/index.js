const adminController = require("./admin.controller");
const slugController = require("./slug.controller");
const metaController = require("./meta.controller");
const circulerController = require("./circuler.controller");
const schoolController = require("./school.controller");
const departmentController = require("./department.controller");
const facultyController = require("./faculty.controller");
const staticPageController = require("./staticPage.controller");
const announcementController = require("./announcement.controller");
const highlightBannerController = require("./highlightBanner.controller");
const componentsController = require('./components.controller')
const  editPathController = require('./EditPath.controller');
module.exports = {
  adminController,
  slugController,
  metaController,
  circulerController,
  editPathController,
  schoolController,
  departmentController,
  facultyController,
  staticPageController,
  announcementController,
  highlightBannerController,
  componentsController
};
