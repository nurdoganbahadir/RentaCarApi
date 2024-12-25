"use strict";

const mongoose = require("mongoose");
const User = require("../models/user");
// const Reservation = require("../models/reservation");
const Car = require("../models/car");

/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

// sync():
module.exports = async function () {
  /* CLEAR DATABASE */
  try {
    await User.deleteMany();
    // await Reservation.deleteMany();
    await Car.deleteMany();
    console.log("- Database and all data DELETED!");
  } catch (error) {
    console.error("Error clearing the database:", error);
    return;
  }
  /* CLEAR DATABASE */

  /* LOAD USERS */
  try {
    const users = require("./user.json");
    await User.insertMany(users);
    console.log("Users added successfully!");
  } catch (error) {
    console.error("Error adding users:", error);
  }

  /* LOAD ROOMS */
  try {
    const cars = require("./car.json");
    await Car.insertMany(cars);
    console.log("Rooms added successfully!");
  } catch (error) {
    console.error("Error adding rooms:", error);
  }

  /* LOAD RESERVATIONS */
  // try {
  //   const reservations = require("./reservation.json");
  //   await Reservation.insertMany(reservations);
  //   console.log("Reservations added successfully!");
  // } catch (error) {
  //   console.error("Error adding reservations:", error);
  // }
};
