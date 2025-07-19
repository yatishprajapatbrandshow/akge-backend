const express = require("express");
const router = express.Router();

const { editPathController} = require("../controller");

router.post('/all', editPathController.editPath);

module.exports = router;