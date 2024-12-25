"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Reservation Controller:
const Reservation = require("../models/reservation");
const Car = require("../models/car");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Reservation);

    res.status(200).send({
      error: false,
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

    console.log(req.body);

    const data = await Reservation.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },
};
