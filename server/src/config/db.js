const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_doctor_db';

  try {
    console.log(`🔌 Connecting to MongoDB...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Notice: ${error.message}`);
    console.warn(`ℹ️  To connect to your cloud database, set MONGODB_URI in server/.env (e.g. MongoDB Atlas connection string).`);
    console.warn(`ℹ️  Server API endpoints will continue running in development mode.`);
    return false;
  }
};

module.exports = connectDB;
