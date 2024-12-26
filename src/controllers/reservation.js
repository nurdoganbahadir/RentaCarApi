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
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    //istenilen aracın müsaitlik tarihlerini kontrol ediyoruz. müsait değilse hata
    // 1. öncelikle çakışan rezervasyonları yakala
    // 2. müsait araçları listele
    // 3. ilgili araca göre tarih sorgusu yapılmalı (carId gönderilecek)
    const { carId } = await Reservation.findOne({ carId: req.body.carId });

    const resDate = await Reservation.findOne({
      carId: req.body.carId,
    });

    if (req.body.carId === carId.toString()) {
      if (
        new Date(req.body.startDate) < resDate.endDate &&
        new Date(req.body.startDate) < resDate.endDate
      ) {
        throw new Error("Araç bu tarihler arasında müsait değildir.");
      }
    }

    //TİME
    const oneDay = 24 * 60 * 60 * 1000;
    const totalDay = (endDate - startDate) / oneDay;

    //AMOUNT
    const { pricePerDay } = await Car.findOne(
      { _id: req.body.carId },
      "pricePerDay"
    );

    if (!(req.user.isAdmin || req.user.isStaff)) {
      //Rezervasyonu müşteri oluşturuyor.
      req.body.userId = req.user._id;
    }

    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;

    req.body.amount = pricePerDay * totalDay;

    // const data = await Reservation.create(req.body);

    res.status(201).send({
      error: false,
      // data,
    });
  },
};
