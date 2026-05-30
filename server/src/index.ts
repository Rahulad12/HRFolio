import app from './app.js';
import connectDB from './legacy/config/db.js';

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
