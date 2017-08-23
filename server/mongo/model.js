var mongoose = require('mongoose')
var UserDataSchema = require('./schema')
mongoose.model('UserDataModel', UserDataSchema)
module.exports = mongoose.model('UserDataModel')
