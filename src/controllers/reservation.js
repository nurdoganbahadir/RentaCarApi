"use strict";

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
    // AMOUNT
    const oneDay = 24 * 60 * 60 * 1000;
    const totalRentDay =
      new Date(req.body.endDate) - new Date(req.body.startDate);
    const dayTotal = totalRentDay / oneDay; // kaç gün olduğunu hesapladık
    const { pricePerDay } = await Car.findOne({ _id: req.body.carId }); // mevcut istenen aracın günlük fiyat bilgisi alındı
    req.body.amount = pricePerDay * dayTotal; // bodye amount hesap edilerek gönderildi

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
  read: async (req, res) => {
    let customFilter = {};

    if (!req.user.isAdmin && !req.user.isStaff) {
      customFilter = { userId: req.user._id };
    }

    const data = await Reservation.findOne({
      _id: req.params.id,
      ...customFilter,
    }).populate([
      { path: "userId", select: "username firstName lastName" },
      { path: "carId" },
      { path: "createdId", select: "username" },
      { path: "updatedId", select: "username" },
    ]);

    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    // AMOUNT
    const oneDay = 24 * 60 * 60 * 1000;
    const totalRentDay =
      new Date(req.body.endDate) - new Date(req.body.startDate);
    const dayTotal = totalRentDay / oneDay; // kaç gün olduğunu hesapladık
    const { pricePerDay } = await Car.findOne({ _id: req.body.carId }); // mevcut istenen aracın günlük fiyat bilgisi alındı
    req.body.amount = pricePerDay * dayTotal; // bodye amount hesap edilerek gönderildi

    if (!req.user.isAdmin) {
      delete req.body.userId;
    }

    req.body.updatedId = req.user._id;
    const data = await Reservation.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      data,
      new: await Reservation.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    const data = await Reservation.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
