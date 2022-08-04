module.exports = app => {
  const Users = require("../controllers/users.controller.js");
  var router = require("express").Router();
  router.post("/sendmessage", Users.fast2sms)
  // Create a new User
  router.post("/", Users.create);
  // signUser 
  router.post("/login", Users.LoginUser);
  //get user from token
  router.post("/getUsersFromToken", Users.getUserFromToken);
  // Retrieve all Users
  router.get("/", Users.findAll);
  // Retrieve a single User with user_id
  router.get("/:user_id", Users.findOne);
  // Update a User with user_id
  router.put("/:user_id", Users.update);
  // Delete a User with user_id
  router.delete("/:user_id", Users.delete);
  // Delete all Users
  router.delete("/", Users.deleteAll);
  //user router all api use with rout
  app.use("/api/Users", router);
};
