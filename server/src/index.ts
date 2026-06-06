import app from './app.js';
import connectDB from './legacy/config/db.js';
import { seedLookupValues } from './legacy/Data/SeedLookupValues.js';
import { seedPermissions } from './legacy/Data/SeedPermissions.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn(
    '\x1b[33m⚠ WARNING: JWT_SECRET is missing or too short (< 32 chars). ' +
    'Generate a strong secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))" \x1b[0m'
  );
}

const start = async () => {
  await connectDB();
  await seedLookupValues();
  await seedPermissions();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
