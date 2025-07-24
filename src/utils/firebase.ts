
// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBr-umNgzEkI6nPnAfz7cFNOjrRDjlFSDQ",
  authDomain: "renamer-86002.firebaseapp.com",
  projectId: "renamer-86002",
  storageBucket: "renamer-86002.firebasestorage.app",
  messagingSenderId: "403961880769",
  appId: "1:403961880769:web:d48b9b65c1f2b4b97bb440"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
async function getIPAddress() {
  try {
    const response = await fetch("https://ipapi.co/ip/");
    const ip = await response.text();
    return ip.trim(); // e.g. "103.21.77.101"
  } catch (err) {
    console.error("IP fetch failed", err);
    return null;
  }
}
export  async function trackByIP() {
  const ip = await getIPAddress();
  if (!ip) return;

  try {
    const docRef = doc(db, "ip_visitors", ip); // Use IP as doc ID
    await setDoc(docRef, {
      userAgent: navigator.userAgent,
      lastSeen: serverTimestamp(),
    }, { merge: true });

    console.log("Tracked IP:", ip);
  } catch (err) {
    console.error("Failed to write IP to Firestore", err);
  }
}
export { auth, provider };
