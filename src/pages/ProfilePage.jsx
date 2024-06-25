import React, { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import {
  FaCheckCircle,
  FaHeart,
  FaAppleAlt,
  FaSun,
  FaTint,
  FaBrain,
  FaBook,
} from "react-icons/fa";
import { Habits } from "../services/db/habits";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [habits, setHabits] = useState([]);
  const { decodedToken, isExpired, reEvaluateToken } = useJwt(
    sessionStorage.getItem("auth")
  );
  const habit = new Habits();
  const loadData = async () => {
    try {
      setLoading(true);

      // Validasi apakah token tersedia
      const userId = decodedToken ? decodedToken.sub : "";

      // Memanggil API untuk mendapatkan data habit berdasarkan ID pengguna
      const response = await habit.getHabitByIdUser(userId);

      if (response && response.data) {
        const filteredDaysStrike = response.data.filter(
          (item) => item.status === "finished"
        );
        setHabits(filteredDaysStrike);
      }
    } catch (error) {
      console.log(`Error from load data habits page: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const achievements = [
    {
      title: "Daily Meditation",
      desc: "Completed 30  of meditation.",
      complete:
        habits.filter((item) => item.habit === "meditate").length >= 30
          ? true
          : false,
      icon: <FaHeart />,
    },
    {
      title: "Consistent Workout",
      desc: "Completed 30  of Running.",
      complete:
        habits.filter((item) => item.habit === "running").length >= 30
          ? true
          : false,
      icon: <FaCheckCircle />,
    },
    {
      complete:
        habits.filter((item) => item.habit === "read books").length >= 30
          ? true
          : false,
      title: "Bookworm",
      desc: "Read 30 books .",
      icon: <FaBook />,
    },
    {
      title: "To Be Stongest",
      desc: "frist login app.",
      complete: decodedToken ? true : false,
      icon: <FaTint />,
    },
    {
      title: "Mindfulness Master",
      desc: "Practiced mindfulness meditation for 50 .",
      complete:
        habits.filter((item) => item.habit === "meditate").length >= 50
          ? true
          : false,
      icon: <FaBrain />,
    },
  ];
  useEffect(() => {
    loadData();
    return () => {
      // Cleanup function if needed
    };
  }, []);
  const completeAciment = achievements.filter((data) => data.complete === true);
  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <nav className="navbar navbar-expand navbar-light bg-white topbar static-top shadow">
        <button
          id="sidebarToggleTop"
          onClick={""}
          className="btn btn-link d-md-none rounded-circle mr-3"
        >
          <i className="fa fa-bars"></i>
        </button>
        <ul className="navbar-nav ml-auto">
          <div className="topbar-divider d-none d-sm-block"></div>
          <li className="nav-item dropdown no-arrow">
            {decodedToken ? (
              <div
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                  {decodedToken.name}
                </span>
                <img
                  class="img-profile rounded-circle"
                  src={
                    localStorage.getItem("urlProfile") ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/OOjs_UI_icon_userAvatar-progressive.svg/1024px-OOjs_UI_icon_userAvatar-progressive.svg.png"
                  }
                />
              </div>
            ) : (
              <div
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="d-flex align-items-center gap-1">
                  <button onClick={() => setOpenModalLogin(true)}>Login</button>
                  <button onClick={() => setOpenModal(true)}>Register</button>
                </span>
              </div>
            )}
          </li>
        </ul>
      </nav>
      <div className="d-flex justify-content-center align-items-center  bg-light">
        <div style={{ flex: "50%" }} className=" text-black p-4 ">
          <h4 className="text-center mb-4">Habit Tracker</h4>
          <p className="text-muted text-center">Habit Archive</p>
          <div className="mb-4">
            <h3 className="text-center text-success">
              {completeAciment.length}/5 Complete
            </h3>
          </div>
          <div className="container my-5">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {achievements.map((achievement, index) => (
                <div className="col" key={index}>
                  <div
                    className={`card h-100 text-center border-0 shadow-sm rounded overflow-hidden position-relative ${
                      achievement.complete ? "bg-success-subtle" : ""
                    }`}
                  >
                    <div className="card-body p-4 d-flex flex-column align-items-center">
                      <div
                        className="card-icon mb-3"
                        style={{
                          fontSize: "50px",
                          color: "#007bff",
                          transition: "color 0.3s",
                        }}
                      >
                        {achievement.icon}
                      </div>
                      <h5 className="card-title mb-2">{achievement.title}</h5>
                      <p className="card-text text-muted">{achievement.desc}</p>
                    </div>
                    <div
                      className="card-overlay position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-0 d-flex align-items-center justify-content-center"
                      style={{ transition: "opacity 0.3s" }}
                    >
                      <h5 className="text-white">View More</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
