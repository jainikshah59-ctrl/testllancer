import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  projectId: "collancer-8fd62",
  authDomain: "collancer-8fd62.firebaseapp.com",
  storageBucket: "collancer-8fd62.firebasestorage.app",
  messagingSenderId: "154521281878",
  appId: "1:154521281878:web:ae6439817888eedd6ce2f7"
};

let app, db, auth;

try {
  app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
    experimentalAutoDetectLongPolling: true
  });
  auth = getAuth(app);

  window.__db = db;
  window.__auth = auth;
} catch (e) {
  console.error("Firebase initialization error", e);
}

export { app, db, auth };
export const fsOps = { getFirestore };
export const authOps = { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
