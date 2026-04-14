// config/db.js
// Connexion MongoDB avec Mongoose

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/podway';

const connectDB = async () => {
  try {
<<<<<<< HEAD
    const conn = await mongoose.connect(MONGO_URI);
=======
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`📦 Base de données  : ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Erreur MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
