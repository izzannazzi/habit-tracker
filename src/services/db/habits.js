import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

export class Habits {
  async addhabit(data, id_user) {
    if (!data || !data.habit || !data.date || !data.time) {
      return {
        statusCode: 400,
        message:
          "Invalid data provided. Make sure habit, date, and time are included.",
        data: null,
      };
    }

    try {
      const response = await addDoc(collection(db, "habits"), {
        ...data,
        id_user,
      });

      // Mendapatkan ID dokumen yang baru saja dibuat
      const newHabitId = response.id;

      // Mengembalikan respons yang berhasil
      return {
        statusCode: 200,
        message: "Habit added successfully",
        data: { user_id: newHabitId },
      };
    } catch (error) {
      // Tangani kesalahan yang terjadi selama menambahkan habit
      console.error("Error adding habit:", error);
      return {
        statusCode: 500,
        message: `Error adding habit: ${error.message}`,
        data: null,
      };
    }
  }
  async getHabitByIdUser(id) {
    // Validasi input id_user
    if (!id) {
      return {
        statusCode: 400,
        message: "Invalid user ID provided.",
        data: null,
      };
    }

    try {
      // Membuat query untuk mengambil dokumen habits dengan id_user yang sesuai
      const q = query(collection(db, "habits"), where("id_user", "==", id));

      // Mengambil dokumen yang sesuai dengan query
      const snapshot = await getDocs(q);

      // Jika tidak ada dokumen yang ditemukan
      if (snapshot.empty) {
        return {
          statusCode: 404,
          message: "No habits found for the given user ID.",
          data: null,
        };
      }

      // Mengumpulkan semua data habit dalam array
      let habits = [];
      snapshot.forEach((doc) => {
        habits.push({ id: doc.id, ...doc.data() });
      });

      // Mengembalikan data habit yang ditemukan
      return {
        statusCode: 200,
        message: "Habits retrieved successfully.",
        data: habits,
      };
    } catch (error) {
      // Menangani kesalahan yang terjadi selama pengambilan data
      console.error("Error retrieving habits:", error);
      return {
        statusCode: 500,
        message: `Error retrieving habits: ${error.message}`,
        data: null,
      };
    }
  }

  async updateHabit(id, habitData) {
    if (!id) {
      return {
        statusCode: 400,
        message: "Invalid ID. ID is required.",
        data: null,
      };
    }

    if (
      !habitData ||
      typeof habitData !== "object" ||
      Array.isArray(habitData)
    ) {
      return {
        statusCode: 400,
        message: "Invalid habit data. Data must be an object.",
        data: null,
      };
    }

    try {
      const habitRef = doc(db, "habits", id);

      // Lakukan update dokumen di Firestore
      await updateDoc(habitRef, habitData);

      return {
        statusCode: 200,
        message: `Habit with ID ${id} successfully updated.`,
        data: null,
      };
    } catch (error) {
      if (error.message.includes("not-found")) {
        return {
          statusCode: 404,
          message: `Habit with ID ${id} not found.`,
          data: null,
        };
      }
      return {
        statusCode: 500,
        message: `Failed to update habit. Error: ${error.message}`,
        data: null,
      };
    }
  }

  async deleteHabit(id) {
    try {
      const habitRef = doc(db, "habits", id);

      await deleteDoc(habitRef);

      return {
        statusCode: 200,
        message: `Habit with ID ${id} successfully deleted.`,
        data: null,
      };
    } catch (error) {
      console.error(`Error deleting habit: ${error.message}`);
      throw new Error(`Error deleting habit: ${error.message}`);
    }
  }
  async getHabitById(id) {
    try {
      // Validasi apakah ID diberikan
      if (!id) {
        return {
          statusCode: 400,
          message: "Invalid ID provided.",
          data: null,
        };
      }

      // Referensi ke dokumen Firestore
      const habitRef = doc(db, "habits", id);

      // Mendapatkan dokumen dari Firestore
      const habitDoc = await getDoc(habitRef);

      // Cek apakah dokumen ditemukan
      if (!habitDoc.exists()) {
        return {
          statusCode: 404,
          message: `Habit with ID ${id} not found.`,
          data: null,
        };
      }

      // Jika ditemukan, kembalikan data dokumen
      return {
        statusCode: 200,
        message: `Habit with ID ${id} successfully retrieved.`,
        data: habitDoc.data(),
      };
    } catch (error) {
      console.log(`Error in getHabitById: ${error.message}`);

      // Kembalikan pesan kesalahan
      return {
        statusCode: 500,
        message: `Failed to retrieve habit. Error: ${error.message}`,
        data: null,
      };
    }
  }
}
