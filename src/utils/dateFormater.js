export function getIatOneDayFromNow() {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik
  const now = Date.now(); // Waktu saat ini dalam milidetik
  return Math.floor((now + oneDayInMilliseconds) / 1000); // Konversi ke detik
}
export const getDateNow = () => {
  const dateNow = new Date();
  return dateNow.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
export function getAmOrPm(timeString) {
  // Memecah waktu menjadi bagian-bagian
  const [hour, minute, second] = timeString.split(":").map(Number);

  // Menentukan periode berdasarkan jam
  if (hour >= 0 && hour < 12) {
    return "AM";
  } else if (hour >= 12 && hour <= 23) {
    return "PM";
  } else {
    throw new Error("Invalid time format");
  }
}
export function checkDatesInOrder(dates) {
  if (!Array.isArray(dates) || dates.length === 0) {
    throw new Error("Input harus berupa array tanggal yang tidak kosong");
  }

  // Mengonversi string tanggal ke objek Date dan mengurutkan
  const sortedDates = dates.map((date) => new Date(date)).sort((a, b) => a - b);

  for (let i = 1; i < sortedDates.length; i++) {
    // Mendapatkan tanggal sebelumnya dan tanggal saat ini
    const prevDate = sortedDates[i - 1];
    const currentDate = sortedDates[i];

    // Menambah satu hari ke tanggal sebelumnya
    const nextDay = new Date(prevDate);
    nextDay.setDate(prevDate.getDate() + 1);

    // Memeriksa apakah tanggal saat ini adalah satu hari setelah tanggal sebelumnya
    if (currentDate.getTime() !== nextDay.getTime()) {
      return false;
    }
  }

  return true;
}
// Fungsi untuk mengonversi format dd/mm/yyyy ke format yyyy-mm-dd
export const convertDateFormat = (dateString) => {
  const [day, month, year] = dateString.split("/");

  // Tambahkan angka satuan jika diperlukan
  const paddedDay = day.length === 1 ? `0${day}` : day;
  const paddedMonth = month.length === 1 ? `0${month}` : month;

  return `${year}-${paddedMonth}-${paddedDay}`;
};

export function getWeekFromDate(dateNow) {
  const startDate = new Date(dateNow);
  const dayOfWeek = startDate.getDay(); // 0 (Sunday) to 6 (Saturday)

  // Adjust to get the start of the week (Sunday)
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startDate.getDate() - dayOfWeek);

  // Create an array for the week
  const week = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    week.push(currentDate);
  }

  return week;
}
// Fungsi untuk mengecek urutan 3 hari berturut-turut dengan mempertimbangkan waktu dan tanggal Indonesia
export function isDateSequenceValid(dates) {
  if (dates.length < 3) {
    return false; // Minimal perlu 3 tanggal untuk memeriksa urutan 3 hari berturut-turut
  }

  let consecutiveDaysCount = 0;
  let previousDate = new Date(dates[0]); // Tetapkan previousDate dengan tanggal pertama

  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);

    // Menghitung perbedaan hari antara dua tanggal dengan mempertimbangkan zona waktu Indonesia
    const differenceInDays = Math.floor(
      (currentDate.setHours(0, 0, 0, 0) - previousDate.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );
    consecutiveDaysCount++;

    if (differenceInDays === 1) {
      if (consecutiveDaysCount >= 3) {
        return true; // Mengembalikan true jika menemukan 3 atau lebih hari yang berurutan
      }
    } else if (differenceInDays > 1) {
      consecutiveDaysCount = 1; // Reset jika tidak berurutan
    }

    // Tetapkan previousDate ke currentDate untuk iterasi berikutnya
    previousDate = currentDate;
  }

  return false; // Mengembalikan false jika tidak menemukan 3 hari yang berurutan
}

// Fungsi untuk mendapatkan hari dalam bahasa Inggris dari tanggal
export const getDayName = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: "long" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
export const tasksPerMonth = (data) => {
  const tasks = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  // Loop through each item in data
  data.forEach((item) => {
    const itemDate = new Date(item.date);
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(itemDate);
    const year = itemDate.getFullYear();

    // Check if status is "finished"
    if (item.status === "finished") {
      // Increment the task count for the corresponding month
      tasks[monthName] += 1;
    }
  });

  // Create array of task counts for each month
  const taskCounts = [
    tasks["January"],
    tasks["February"],
    tasks["March"],
    tasks["April"],
    tasks["May"],
    tasks["June"],
    tasks["July"],
    tasks["August"],
    tasks["September"],
    tasks["October"],
    tasks["November"],
    tasks["December"],
  ];

  return taskCounts;
};

export const tasksPerYear = (data) => {
  const tasks = {};

  data.forEach((item) => {
    const itemDate = new Date(item.date);
    const year = itemDate.getFullYear();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(itemDate);

    if (item.status === "finished") {
      if (!tasks[year]) {
        tasks[year] = {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0,
        };
      }
      tasks[year][monthName] += 1;
    }
  });

  const taskCountsPerYear = {};
  Object.keys(tasks).forEach((year) => {
    taskCountsPerYear[year] = [
      tasks[year]["January"],
      tasks[year]["February"],
      tasks[year]["March"],
      tasks[year]["April"],
      tasks[year]["May"],
      tasks[year]["June"],
      tasks[year]["July"],
      tasks[year]["August"],
      tasks[year]["September"],
      tasks[year]["October"],
      tasks[year]["November"],
      tasks[year]["December"],
    ];
  });

  return taskCountsPerYear;
};

export function convertToDateTime(dateString, timeString) {
  // Pisahkan tanggal dan waktu
  const [year, month, day] = dateString.split("-");
  const [hour, minute] = timeString.split(":");

  // Buat objek Date dengan tanggal dan waktu yang diberikan
  const dateTime = new Date(year, month - 1, day, hour, minute);

  // Atur zona waktu menjadi WIB (Waktu Indonesia Bagian Barat)
  const options = { timeZone: "Asia/Jakarta" };
  const formattedDateTime = dateTime.toLocaleString("en-ID", {
    ...options,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return formattedDateTime;
}
