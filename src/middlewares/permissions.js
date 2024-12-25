"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Middleware: permissions

module.exports = {
  isLogin: (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      if (req.user && req.user.isActive) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login.");
      }
    } else {
      next();
    }
  },

  isStaffOrAdmin: (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      if (
        req.user &&
        req.user.isActive &&
        (req.user.isAdmin || req.user.isStaff)
      ) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error(
          "NoPermission: You must login and to be admin or staff"
        );
      }
    } else {
      next();
    }
  },

  isAdmin: (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      if (req.user && req.user.isAdmin && req.user.isActive) {
        next();
      } else {
        res.errorStatusCode = 403;
        throw new Error("NoPermission: You must login and to be Admin.");
      }
    } else {
      next();
    }
  },
};
