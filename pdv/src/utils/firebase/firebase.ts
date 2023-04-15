import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const API_KEY = import.meta.env.API_KEY
const AUTH_DOMAIN = import.meta.env.AUTH_DOMAIN
const PROJECT_ID = import.meta.env.PROJECT_ID
const STORAGE_BUCKET = import.meta.env.STORAGE_BUCKET
const MESSAGING_SENDER_ID = import.meta.env.MESSAGING_SENDER_ID
const APP_ID = import.meta.env.APP_ID

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: "simpls-6a1a3",
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const DOC_PATH = import.meta.env.DEV ? "empresas_dev" : "empresas"

/* const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const DOC_PATH = import.meta.env.DEV ? "empresas_dev" : "empresas" */