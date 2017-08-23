var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')
var UserDataSchema = new Schema({
  name: String,
  password: String,
  email: String,
  newQnId: 0,
  qnData: [
    {
      expires: String,
      publish: Boolean,
      qnId: String,
      title: String,
      questions: []
    }
  ]
})
UserDataSchema.methods = {
  comparePassword: function (_userPassword, callback) {
    bcrypt.compare(_userPassword, this.password, function (err, isMatch) {
      if (err) {
        return callback(err)
      }
      callback(null, isMatch)
    })
  }
}
module.exports = UserDataSchema
