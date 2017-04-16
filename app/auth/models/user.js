import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userModel = new Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const User = mongoose.model('User', userModel);

export default User;
