
   const mongoose = require('mongoose');

   const userSchema = new mongoose.Schema({
     email: {
       type: String,
       required: true,
       unique: true,
     },
     password: {
       type: String,
       required: true,
     },
     fullName: {
       type: String,
       required: true,
     },
     profilePicture: {
       type: String,
       default: '', // Adicione este campo
     },
     isActive: {
       type: Boolean,
       default: true,
     },
     role: {
       type: String,
       enum: ['user', 'admin'],
       default: 'user',
     },
     createdAt: {
       type: Date,
       default: Date.now,
     },
     lastLoginAt: {
       type: Date,
     },
     refreshToken: {
       type: String,
     },
   }, {
     versionKey: false,
   });

   const User = mongoose.model('User', userSchema);

   module.exports = User;