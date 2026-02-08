require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const projectRoot = path.join(__dirname, '..');

// Initialize Firebase Admin (service account: env or serviceAccountKey.json in project root)
let firebaseInitialized = false;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized (application default)');
  } catch (e) {
    console.error('Firebase init error:', e.message);
  }
}
if (!firebaseInitialized && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const cred = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized (env JSON)');
  } catch (e) {
    console.error('Firebase init error:', e.message);
  }
}
if (!firebaseInitialized) {
  const keyPath = path.join(projectRoot, 'serviceAccountKey.json');
  let keyFile = keyPath;
  if (!fs.existsSync(keyPath)) {
    const dir = fs.readdirSync(projectRoot);
    const adminsdk = dir.find((f) => f.endsWith('.json') && f.includes('firebase') && f.includes('adminsdk'));
    if (adminsdk) keyFile = path.join(projectRoot, adminsdk);
  }
  if (fs.existsSync(keyFile)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      firebaseInitialized = true;
      console.log('✅ Firebase Admin initialized:', path.basename(keyFile));
    } catch (e) {
      console.error('Firebase init error:', e.message);
    }
  }
}
if (!firebaseInitialized) {
  console.warn('⚠️ Firebase not configured. Add serviceAccountKey.json (or *firebase*adminsdk*.json) to the project root, or set GOOGLE_APPLICATION_CREDENTIALS / FIREBASE_SERVICE_ACCOUNT in .env');
}

const db = admin.firestore && firebaseInitialized ? admin.firestore() : null;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Verify Firebase ID token and set req.uid
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid Authorization header' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  if (!firebaseInitialized || !admin.auth) {
    return res.status(503).json({
      error: 'Auth not configured',
      hint: 'Set GOOGLE_APPLICATION_CREDENTIALS (path to serviceAccountKey.json) or FIREBASE_SERVICE_ACCOUNT (JSON string) in .env. See FIREBASE_SETUP.md.',
    });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.uid = decoded.uid;
    req.userEmail = decoded.email;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

// Helper: get collection ref for user-scoped data (each collection has docs with userId field)
function getCol(name) {
  if (!db) throw new Error('Firestore not available');
  return db.collection(name);
}

// All API routes require auth and use Firestore
// Year route must be before :year/:month so /api/data/year/2027 is not matched as year="year", month="2027"
app.get('/api/data/year/:year', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const { year } = req.params;
    const uid = req.uid;
    const y = parseInt(year, 10);
    if (isNaN(y)) return res.status(400).json({ error: 'Invalid year' });

    const [salariesSnap, expensesSnap, investmentsSnap, activitiesSnap] = await Promise.all([
      getCol('salaries').where('userId', '==', uid).where('year', '==', y).get(),
      getCol('expenses').where('userId', '==', uid).where('year', '==', y).get(),
      getCol('investments').where('userId', '==', uid).where('year', '==', y).get(),
      getCol('activities').where('userId', '==', uid).where('year', '==', y).get()
    ]);

    const toData = (snap, idKey = 'id') =>
      snap.docs.map(d => ({ [idKey]: d.id, ...d.data() }));

    res.json({
      salaries: toData(salariesSnap),
      expenses: toData(expensesSnap),
      investments: toData(investmentsSnap),
      activities: toData(activitiesSnap)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/data/:year/:month', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const { year, month } = req.params;
    const uid = req.uid;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    if (isNaN(y) || isNaN(m)) return res.status(400).json({ error: 'Invalid year or month' });

    const [salariesSnap, expensesSnap, investmentsSnap, activitiesSnap] = await Promise.all([
      getCol('salaries').where('userId', '==', uid).where('year', '==', y).where('month', '==', m).get(),
      getCol('expenses').where('userId', '==', uid).where('year', '==', y).where('month', '==', m).get(),
      getCol('investments').where('userId', '==', uid).where('year', '==', y).where('month', '==', m).get(),
      getCol('activities').where('userId', '==', uid).where('year', '==', y).where('month', '==', m).get()
    ]);

    const toData = (snap, idKey = 'id') =>
      snap.docs.map(d => ({ [idKey]: d.id, ...d.data() }));

    res.json({
      salaries: toData(salariesSnap),
      expenses: toData(expensesSnap),
      investments: toData(investmentsSnap),
      activities: toData(activitiesSnap)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/salaries', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const { person, amount, date, month, year } = req.body;
    const doc = {
      userId: req.uid,
      person: person || req.userEmail || 'Me',
      amount: Number(amount),
      date: String(date),
      month: Number(month),
      year: Number(year)
    };
    const ref = await getCol('salaries').add(doc);
    res.json({ id: ref.id, ...doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const { title, amount, category, paidBy, date, month, year, notes } = req.body;
    const doc = {
      userId: req.uid,
      title: String(title),
      amount: Number(amount),
      category: String(category),
      paidBy: paidBy || req.userEmail || 'Me',
      date: String(date),
      month: Number(month),
      year: Number(year),
      notes: notes != null ? String(notes) : ''
    };
    const ref = await getCol('expenses').add(doc);
    res.json({ id: ref.id, ...doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/investments', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const { type, amount, owner, date, month, year, returnPercent, notes } = req.body;
    const doc = {
      userId: req.uid,
      type: String(type),
      amount: Number(amount),
      owner: owner || req.userEmail || 'Me',
      date: String(date),
      month: Number(month),
      year: Number(year),
      returnPercent: returnPercent != null ? Number(returnPercent) : null,
      notes: notes != null ? String(notes) : ''
    };
    const ref = await getCol('investments').add(doc);
    res.json({ id: ref.id, ...doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/activities', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const { title, amount, type, person, date, month, year, notes } = req.body;
    const doc = {
      userId: req.uid,
      title: String(title),
      amount: Number(amount),
      type: String(type),
      person: person || req.userEmail || 'Me',
      date: String(date),
      month: Number(month),
      year: Number(year),
      notes: notes != null ? String(notes) : ''
    };
    const ref = await getCol('activities').add(doc);
    res.json({ id: ref.id, ...doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/salaries/:id', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const ref = getCol('salaries').doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists || snap.data().userId !== req.uid) return res.status(404).json({ error: 'Not found' });
    await ref.delete();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/expenses/:id', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const ref = getCol('expenses').doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists || snap.data().userId !== req.uid) return res.status(404).json({ error: 'Not found' });
    await ref.delete();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/investments/:id', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const ref = getCol('investments').doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists || snap.data().userId !== req.uid) return res.status(404).json({ error: 'Not found' });
    await ref.delete();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/activities/:id', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const ref = getCol('activities').doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists || snap.data().userId !== req.uid) return res.status(404).json({ error: 'Not found' });
    await ref.delete();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Household members (add as many as you want)
app.get('/api/members', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const snap = await getCol('members').where('userId', '==', req.uid).get();
    const members = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0));
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/members', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const doc = { userId: req.uid, name, createdAt: new Date() };
    const ref = await getCol('members').add(doc);
    res.json({ id: ref.id, name: doc.name, createdAt: doc.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/members/:id', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const ref = getCol('members').doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists || snap.data().userId !== req.uid) return res.status(404).json({ error: 'Not found' });
    await ref.delete();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const defaultFunds = {
  emergency: { enabled: false, target: 0, current: 0 },
  vacation: { enabled: false, target: 0, current: 0 }
};

app.get('/api/funds', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const ref = getCol('funds').doc(req.uid);
    const snap = await ref.get();
    const data = snap.exists ? snap.data() : defaultFunds;
    res.json({
      emergency: data.emergency || defaultFunds.emergency,
      vacation: data.vacation || defaultFunds.vacation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/funds', requireAuth, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not available' });
    const ref = getCol('funds').doc(req.uid);
    const body = req.body || {};
    const snap = await ref.get();
    const existing = snap.exists ? snap.data() : defaultFunds;
    const merged = {
      emergency: body.emergency
        ? { enabled: Boolean(body.emergency.enabled), target: Number(body.emergency.target) || 0, current: Number(body.emergency.current) || 0 }
        : existing.emergency || defaultFunds.emergency,
      vacation: body.vacation
        ? { enabled: Boolean(body.vacation.enabled), target: Number(body.vacation.target) || 0, current: Number(body.vacation.current) || 0 }
        : existing.vacation || defaultFunds.vacation
    };
    await ref.set(merged);
    res.json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
