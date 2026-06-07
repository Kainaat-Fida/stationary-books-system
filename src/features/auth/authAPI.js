import { auth, db } from "../../app/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// -------------------------------------------
// Email Signup
// -------------------------------------------
export const signUpUser = async ({ email, password, role, name, shopName, profileImage }) => {
  // 1️⃣ Create user in Firebase Auth
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  // 2️⃣ Prepare user document for Firestore
  const userData = {
    email,
    role,                       // 'seller' or 'customer'
    name: name || "",
    shopName: shopName || "",
    photoURL: profileImage || "",
    createdAt: serverTimestamp(),
  };

  // 3️⃣ Save in Firestore
  await setDoc(doc(db, "users", user.uid), userData);

  return { user: { uid: user.uid, email: user.email }, role, userData };
};

// -------------------------------------------
// Email Login
// -------------------------------------------
export const signInUser = async (email, password) => {
  // 1️⃣ Sign in with Firebase Auth
  const res = await signInWithEmailAndPassword(auth, email, password);
  const user = res.user;

  // 2️⃣ Fetch Firestore document for the **logged-in user only**
  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists()) {
    throw new Error("User profile not found in Firestore.");
  }

  const data = snap.data();
  const role = data?.role || "customer";

  // 3️⃣ Convert timestamps to ISO strings
  const userData = {
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
  };

  return {
    user: { uid: user.uid, email: user.email },
    role,
    userData,
  };
};

// -------------------------------------------
// Google Login
// -------------------------------------------
export const googleSignInUser = async () => {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  const user = res.user;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  let role = "customer"; // default role
  let userData = null;

  // 1️⃣ If user document doesn't exist, create one
  if (!snap.exists()) {
    userData = {
      email: user.email,
      role,
      name: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, userData);
  } else {
    // 2️⃣ If exists, read the document
    const data = snap.data();
    role = data.role || "customer";
    userData = {
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    };
  }

  return {
    user: { uid: user.uid, email: user.email },
    role,
    userData,
  };
};
