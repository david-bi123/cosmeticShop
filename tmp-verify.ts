import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[k] = v;
  }
}

async function main() {
  const { dbConnect } = await import('@/lib/db');
  const { User } = await import('@/models/User');
  await dbConnect();

  const checks = [
    { email: 'admin@lumiere.gh', pw: 'Admin123!', role: 'super_admin' },
    { email: 'staff0@lumiere.gh', pw: 'Staff123!', role: 'staff' },
    { email: 'customer0@example.com', pw: 'Customer123!', role: 'customer' },
  ];
  let ok = true;
  for (const c of checks) {
    const u = await User.findOne({ email: c.email }).select('+password').lean();
    if (!u) { console.log(`MISSING user: ${c.email}`); ok = false; continue; }
    const match = await bcrypt.compare(c.pw, (u as any).password);
    const roleOk = (u as any).role === c.role;
    console.log(`${match && roleOk ? 'OK ' : 'FAIL'} ${c.email} | pw=${match} role=${roleOk ? (u as any).role : 'WRONG(' + (u as any).role + ')'} verified=${(u as any).emailVerified}`);
    if (!match || !roleOk) ok = false;
  }

  // JWT roundtrip with the app's secret/expiry
  const secret = process.env.JWT_SECRET || 'fallback';
  const token = jwt.sign({ userId: 'x', email: 'admin@lumiere.gh', role: 'super_admin', name: 'Lumière Admin' }, secret, { expiresIn: (process.env.JWT_EXPIRES || '7d') as any });
  const decoded = jwt.verify(token, secret);
  console.log(`JWT roundtrip: ${decoded ? 'OK' : 'FAIL'}`);
  if (!decoded) ok = false;

  // Counts
  const counts = {
    users: await User.countDocuments(),
    admins: await User.countDocuments({ role: { $in: ['super_admin', 'admin', 'staff'] } }),
    customers: await User.countDocuments({ role: 'customer' }),
  };
  console.log('Counts:', JSON.stringify(counts));
  console.log(ok ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED');
  process.exit(ok ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
