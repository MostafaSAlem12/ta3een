const express = require("express");
const router = new express.Router();
const {
  getReportsPage,
  deleteAll,
  deleteReport,
} = require("../controllers/report_controller");
router.get("/:tab", getReportsPage);
router.get("/:tab/delete", deleteAll);
router.delete("/:tab/:id/delete", deleteReport);

module.exports = router;
