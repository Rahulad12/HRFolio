import app from './app.js';
import connectDB from './legacy/config/db.js';
import { seedLookupValues } from './legacy/Data/SeedLookupValues.js';
import { seedPermissions } from './legacy/Data/SeedPermissions.js';

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
