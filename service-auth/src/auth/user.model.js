const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    correo: {
      type: String,
      required: [true, 'El correo electronico es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    contrasena: {
      type: String,
      required: [true, 'La contrasena es obligatoria'],
      select: false, 
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.contrasena;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
