require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`School API listening on http://localhost:${PORT}`)))
  .catch((error) => { console.error(error.message); process.exit(1); });
