import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Dashboard from "./pages/Dashboard";
import "./assets/jquery/sbAdminJquery.js";
import "./assets/js/sbAdmin.js";
import "./assets/css/sbAdmin.css";
import "./assets/css/fontAwesomeIcon.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import ModalComp from "./components/ModalComp.jsx";
ChartJS.register(ArcElement, Tooltip, Legend);

import { auth } from "./services/firebase/config.js";

import HabitsPage from "./pages/HabitsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import { useJwt } from "react-jwt";
function App() {
  const { decodedToken, isExpired, reEvaluateToken } = useJwt(
    sessionStorage.getItem("auth")
  );
  const [toggle, setToggle] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [comp, setComp] = useState(<Dashboard />);

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    localStorage.removeItem("urlProfile");
    window.location.reload();
  };
  const handleRoute = (value) => {
    switch (value) {
      case "dashboard":
        setActiveNav("dashboard");
        setComp(<Dashboard />);
        break;

      case "habit":
        setActiveNav("habit");

        setComp(<HabitsPage />);
        break;

      case "profile":
        setActiveNav("profile");

        setComp(<ProfilePage />);
        break;

      default:
        setComp(<Dashboard />);
        break;
    }
  };

  return (
    <>
      <main>
        <div id="page-top" classNameName={"toggle" ? "sidebar-toggled" : ""}>
          <div id="wrapper">
            <ul
              className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion  ${
                "toggle" ? "toggled" : ""
              } `}
              id="accordionSidebar"
            >
              <a className="sidebar-brand mb-3" href="index.html">
                <div className="sidebar-brand-icon rotate-n-15">
                  <i className="fa-solid fa-leaf"></i>
                </div>
                <div className="sidebar-brand-text mx-3 text-nowrap ">
                  Habit Tracker
                </div>
              </a>
              <hr className="sidebar-divider my-0" />

              <hr className="sidebar-divider" />
              <div className="sidebar-heading">Main</div>
              <li
                className={`nav-item ${
                  activeNav === "dashboard" ? "active" : ""
                }`}
                onClick={() => handleRoute("dashboard")}
                style={{ cursor: "pointer" }}
              >
                <span className="nav-link">
                  <i className="fas fa-fw fa-tachometer-alt"></i>
                  <span>Dashboard</span>
                </span>
              </li>
              {decodedToken === null ? (
                ""
              ) : (
                <div>
                  <li
                    className={`nav-item ${
                      activeNav === "habit" ? "active" : ""
                    }`}
                    onClick={() => handleRoute("habit")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="nav-link ">
                      <i className="fa-regular fa-star"></i>
                      <span>Habits</span>
                    </span>
                    <div
                      id="collapseTwo"
                      className="collapse"
                      aria-labelledby="headingTwo"
                      data-parent="#accordionSidebar"
                    >
                      <div className="bg-white py-2 collapse-inner rounded">
                        <h6 className="collapse-header">Custom Components:</h6>
                        <a className="collapse-item" href="buttons.html">
                          Buttons
                        </a>
                        <a className="collapse-item" href="cards.html">
                          Cards
                        </a>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`nav-item ${
                      activeNav === "profile" ? "active" : ""
                    }`}
                    onClick={() => handleRoute("profile")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="nav-link " href="#">
                      <i class="fa-solid fa-star"></i>
                      <span>Achievement</span>
                    </span>
                    <div
                      id="collapsePages"
                      className="collapse"
                      aria-labelledby="headingPages"
                      data-parent="#accordionSidebar"
                    ></div>
                  </li>
                </div>
              )}

              {sessionStorage.getItem("auth") && (
                <li
                  className="nav-item"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={handleLogout}
                >
                  <a className="nav-link " href="#">
                    <i className="fa-solid fa-right-to-bracket"></i>
                    <span>Logout</span>
                  </a>
                  <div
                    id="collapsePages"
                    className="collapse"
                    aria-labelledby="headingPages"
                    data-parent="#accordionSidebar"
                  ></div>
                </li>
              )}
            </ul>
            {comp}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
