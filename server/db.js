import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/main');

const db = mongoose.connection;

export default db;
