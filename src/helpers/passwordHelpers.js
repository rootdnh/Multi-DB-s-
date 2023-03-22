const Bcrypt = require('bcrypt');
const SALT = 3;
const {
  promisify
} = require('util');

const hashAsync = promisify(Bcrypt.hash);
const compareAsync = promisify(Bcrypt.compare);

class PasswordHelper {
  static hashPassword(pass) {
    return hashAsync(pass, SALT);
  }
  static comparePassword(pass, hash){
    return compareAsync(pass, hash);
  }
}

module.exports = PasswordHelper;