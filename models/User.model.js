const mongoose = require('mongoose')
const Schema = mongoose.Schema
//const Event = require('../models/Event.model')



const UserSchema = new Schema({
  // userId: { type: String, required: true },
   email: { type: String, required: true },
   password:{ type: String, required: true},
   name: { type: String, required: true },
   created: { type: Date, default: Date.now },
   roles: { type: String, default: "faculty", required:true }
 })

module.exports = User = mongoose.model('user', UserSchema)