import mongoose from 'mongoose';

export async function connectDb(uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tactyqal_blog') {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  await mongoose.model('Post').init(); // make sure indexes (incl. unique slug) exist
  return mongoose.connection;
}

export const disconnectDb = () => mongoose.disconnect();
