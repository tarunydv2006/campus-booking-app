import User from '../models/User.js';

export const ensureAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    const missing = [
      !adminEmail ? 'ADMIN_EMAIL' : null,
      !adminPassword ? 'ADMIN_PASSWORD' : null
    ].filter(Boolean);
    console.warn(`Admin seed skipped. Missing: ${missing.join(', ')}`);
    return;
  }

  await User.deleteMany({ role: 'admin', email: { $ne: adminEmail } });

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    existingAdmin.name = existingAdmin.name || 'Campus Admin';
    existingAdmin.password = adminPassword;
    existingAdmin.role = 'admin';
    existingAdmin.department = existingAdmin.department || 'Administration';
    existingAdmin.isVerified = true;
    existingAdmin.otpCode = null;
    existingAdmin.otpExpiresAt = null;
    await existingAdmin.save();
    console.log(`Admin updated in ${User.collection.name}: ${existingAdmin.email}`);
    return existingAdmin;
  }

  const admin = await User.create({
    name: 'Campus Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    department: 'Administration',
    isVerified: true
  });

  console.log(`Admin created in ${User.collection.name}: ${admin.email}`);
  return admin;
};
