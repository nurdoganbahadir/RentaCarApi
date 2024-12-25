"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require("express").Router();
const res = require("../controllers/reservation");
/* ------------------------------------------------------- */
// routes/reservation:

router.route("/").get(res.list).post(res.create);

module.exports = router;
