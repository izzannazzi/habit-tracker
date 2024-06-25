import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import bcrypt from "bcryptjs-react";
// import { adminInit } from "../firebase/admin.config";

export class User {

  async addUser(email, fullname, password) {
    try {
      // Validasi panjang password
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      // Hash password
      const hash = await bcrypt.hash(password, 12);

      // Tambahkan pengguna baru ke koleksi 'users' di Firestore
      const data = await addDoc(collection(db, "users"), {
        user: fullname,
        email: email,
        password: hash || "",
      });

 
      return {
        statusCode: 200,
        message: "User added successfully",
        data: { userId: data.id },
      };
    } catch (error) {
      console.error(`Error from addUser: ${error.message}`);

      let errorMessage;
      
      switch (error.code) {
        case "permission-denied":
          errorMessage = "You do not have permission to add a user.";
          break;
        case "network-request-failed":
          errorMessage = "Network error. Please try again later.";
          break;
        case "already-exists":
          errorMessage = "A user with this email already exists.";
          break;
        default:
          errorMessage = error.message || "An unknown error occurred.";
      }

      return {
        statusCode: 500,
        message: `Error from addUser: ${errorMessage}`,
        data: null,
      };
    }
  }

  async userLogin(fullname, password) {
    try {
      // Buat query untuk mencari pengguna berdasarkan fullname
      const q = query(collection(db, "users"), where("user", "==", fullname));

      // Ambil dokumen yang sesuai dengan query
      const querySnapshot = await getDocs(q);

      // Periksa apakah ada dokumen yang cocok
      if (querySnapshot.empty) {
        return {
          statusCode: 404,
          message: "No such user!",
          data: null,
        };
      }

      let userData = null;
      let userId = null;
      querySnapshot.forEach((doc) => {
        userData = doc.data();
        userId = doc.id;
      });

      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (passwordMatch) {
          return {
            statusCode: 200,
            message: "login successfuly",
            data: { ...userData, userId },
          };
        } else {
          return {
            statusCode: 401,
            message: "Incorrect password",
            data: null,
          };
        }
      } else {
        return {
          statusCode: 404,
          message: "User not found",
          data: null,
        };
      }
    } catch (error) {
      console.log(`Error during user login: ${error.message}`);
      return null;
    }
  }
}
