import { DateTime } from "luxon";
export class NotificationHandler {
  constructor() {
    this.requestNotificationPermission();
  }

  requestNotificationPermission() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.warn("Notification permission denied.");
        }
      });
    } else {
      console.log("Notification permission already granted.");
    }
  }

  scheduleNotification(date, time, data) {
    const currentDateTime = DateTime.local().toFormat("HH:mm:ss");
    const scheduledDateTime = DateTime.fromFormat(
      `${date} ${time}`,
      "yyyy-MM-dd HH:mm",
      { zone: "Asia/Jakarta" }
    ).toFormat("HH:mm:ss");

    if (scheduledDateTime === currentDateTime) {
      this.showNotification(data);
    } else {
      console.log(`Notification not scheduled for ${date} ${time}.`);
    }
  }

  showNotification(data) {
    if (Notification.permission === "granted") {
      const notification = new Notification("Scheduled Notification", {
        body: data,
      });

      notification.onclick = () => {
        console.log("Notification clicked.");
      };
    } else {
      console.warn("Notification permission is not granted.");
    }
  }
}
