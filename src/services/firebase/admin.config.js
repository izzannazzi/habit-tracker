import admin from "firebase-admin";
import { firebaseConfig } from "./config";

export const adminInit = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});
