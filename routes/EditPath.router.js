const express = require("express");
const router = express.Router();

const { editPathController} = require("../controller");

router.post('/edit-path', editPathController.editPath);

module.exports = router;