const db = require("../models");
const Users = db.Users;
const Op = db.Sequelize.Op;
const newOTP = require('otp-generators')
const fast2sms = require('fast-two-sms')
let { signUser, verify } = require("../utils/token.js")
const totp = require("totp-generator");
const sendSms = require('../twilio');

// send this message otp api
exports.fast2sms = (req, res) => {

  console.log(req.body.otp)
  console.log(req.body.number)

  sendMessage(req.body.otp, req.body.number, res)
}

function sendMessage(otp, number, res) {
  var options = {
    authorization:
      "hXaH54sfbn6wuvAZ0Nl2SrRjqOI1zGD3VeKyQ8Jc7ixYWUFCpt5r81N9HUApFZhvbWCBtoKIxs32MS67",
    otp: otp,
    numbers: [number],
  };

  // send this message

  fast2sms
    .sendMessage(options)
    .then((response) => {
      res.send("SMS OTP Code Sent Successfully")
    })
    .catch((error) => {
      res.send("Some error taken place")
    });
}

// Create and Save a new User
exports.create = (req, res) => {

  // Valate request
  if (!req.body.number) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  
  // Create a User
  const User = {
    
    username: req.body.username,
    number: req.body.number,
    // otp: newOTP.generate(6, {step: 60, alphabets: false, upperCase: false, specialChar: false,period: 60, timestamp: 120})

    // prints a token using a 60-second epoch interval
    otp: token = totp("JBSWY3DPEHPK3PXP", {
      digits: 6,
      period: 120,
      timestamp: 1465324707000
    })

  };
  console.log(token);

  // Save User in the database
  // const welcomeMessage = 'Welcome to Chillz! Your verification code is 54875';
  // sendSms(Users.number,Users.username, welcomeMessage);
  Users.create(User)
    .then(data => {
      res.send(data);
      let token = signUser({ ...data.dataValues })
    })

    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const number = req.query.number;
  var condition = number ? { number: { [Op.iLike]: `%${number}%` } } : null;

  Users.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};

// Find a User with an login
exports.LoginUser = async (req, res) => {
  try {
    let data = await Users.findOne({ where: req.body });
    let token = await signUser({ ...data.dataValues })

    // console.log("data" ,data)
    // console.log("name",data.dataValues.name)
    // console.log("user_id",data.dataValues.user_id)
    res.status(200).json({
      token, data: {
        user_id: data.dataValues.user_id,
        // number: data.dataValues.number,
        otp: data.dataValues.otp

      }
    })

  } catch (error) {
    res.status(500).json({ success: "0", error: error.message })
  }
}

// token ger user
exports.getUserFromToken = async (req, res) => {
  try {
    const token = req.body.token;
    let user = await verify(token)
    res.status(200).json({
      token, data: user
    })
  } catch (error) {
    res.status(200).json({ success: "0", error: error.message })
  }
}

// Find a single User with an user_id
exports.findOne = (req, res) => {
  const user_id = req.params.user_id;

  Users.findByPk(user_id)
    .then(data => {
      res.send(data);
      let token = signUser({ ...data.dataValues })
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with user_id=" + user_id
      });
    });
};

// Update a User by the user_id in the request
exports.update = (req, res) => {
  const user_id = req.params.user_id;
  let token = req.headers.authorization;
  token = token.split(" ")[1];
  let Users = verify(token);
  Users.update(req.body, {
    where: { user_id: user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with user_id=${user_id}. Maybe User was not found or req.body is empty!`
        });
        
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with user_id=" + user_id
      });
    });
};

// Delete a User with the specified user_id in the request
exports.delete = (req, res) => {
  const user_id = req.params.user_id;

  Users.destroy({
    where: { user_id: user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with user_id=${user_id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with user_id=" + user_id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  Users.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Users."
      });
    });
};


