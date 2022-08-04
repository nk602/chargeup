
const jwt = require('jsonwebtoken');
const SECRET = require("../../secret.js");
module.exports.signUser = function signUser(user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });
}


module.exports.verify = function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
}