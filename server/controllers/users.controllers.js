const { selectAllUsers } = require("../models/users.models");

const getAllUsers = (req, res, next) => {
  return selectAllUsers()
    .then((data) => {
      return res.status(200).send({ users: data });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllUsers };
