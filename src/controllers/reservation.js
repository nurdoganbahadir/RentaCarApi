"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Reservation Controller:
const Reservation = require("../models/reservation");
const Car = require("../models/car");

module.exports = {
  list: async (req, res) => {
    let customFilter = {};

    if (!req.user.isAdmin && !req.user.isStaff) {
      customFilter = { userId: req.user._id };
    }

    const data = await res.getModelList(Reservation, customFilter, [
      { path: "userId", select: "username firstName lastName" },
      { path: "carId" },
      { path: "createdId", select: "username" },
      { path: "updatedId", select: "username" },
    ]);

    const details = await res.getModelListDetails(Reservation, customFilter);

    res.status(200).send({
      error: false,
      details,
      data,
    });
  },

  create: async (req, res) => {
    if ((!req.user.isAdmin && !req.user.isStaff) || !req.user?.userId) {
      req.body.userId = req.user._id;
    }

    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;

    const userReservationDates = await Reservation.findOne({
      userId: req.body.userId,
      $nor: [
        { startDate: { $gt: req.body.endDate } },
        { endDate: { $lt: req.body.startDate } },
      ],
    });

    if (userReservationDates) {
      res.errorStatusCode = 400;
      throw new Error(
        "It cannot be added because there is another reservation with the same date",
        { cause: { userReservationDates: userReservationDates } }
      );
    } else {
      const data = await Reservation.create(req.body);

      res.status(200).send({
        error: false,
        data,
      });
    }
  },
};
