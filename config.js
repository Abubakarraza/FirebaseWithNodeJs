const {
  initializeApp,
  applicationDefault,
  cert,
} = require('firebase-admin/app');
const serviceAccount = require('./credent.json');
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require('firebase-admin/firestore');
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
module.exports = { db };
