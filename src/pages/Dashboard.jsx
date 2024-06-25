import React, { useEffect, useState } from "react";
import { Bar, Line, Chart } from "react-chartjs-2";
import { useJwt } from "react-jwt";
import ModalComp from "../components/ModalComp";
import { User } from "../services/db/users";
import { encodeUser } from "../utils/encodeJwt";
import {
  getDayName,
  getIatOneDayFromNow,
  getWeekFromDate,
  tasksPerMonth,
  tasksPerYear,
} from "../utils/dateFormater";
import { confirmSwal } from "../utils/SweetAlert";
import { Habits } from "../services/db/habits";
import CardNews from "../components/CardNews";
import { getNewsID } from "../services/api/NewsApi";
const Dashboard = ({ CloseSidebar }) => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [apiData, setApiData] = useState([]);
  const [filteredDataWeekDates, setFilteredDataWeekDates] = useState([]);
  const [task, setTask] = useState({
    finished: "",
    unfinished: "",
  });
  const user = new User();

  const { decodedToken, isExpired, reEvaluateToken } = useJwt(
    sessionStorage.getItem("auth")
  );
  const habit = new Habits();

  const toggleSidebar = () => {
    const newSidebarState = !isSidebarOpen;
    setIsSidebarOpen(newSidebarState);
    CloseSidebar(newSidebarState);
  };
  const handleonChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlRegisterUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await user.addUser(data.email, data.name, data.password);
      console.log(res);
      if (
        res.statusCode === 400 ||
        res.statusCode === 404 ||
        res.statusCode === 500
      ) {
        setErrorMessage(res.message);

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
      if (res.statusCode == 200) {
        setOpenModalLogin(confirmSwal("Login Success!", res.message, true));

        setOpenModalLogin(false);
      }
    } catch (error) {
      console.log(`error handle register user ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleLoginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await user.userLogin(data.name, data.password);

      if (res.statusCode === 400 || res.statusCode === 404) {
        setErrorMessage(res.message);
        console.log(res.message);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
      if (res.statusCode == 200) {
        encodeUser({
          sub: res.data.userId,
          name: res.data.user,
          iat: getIatOneDayFromNow(),
        });
        setOpenModalLogin(confirmSwal("Login Success!", res.message, true));
      }
    } catch (error) {
      console.log(`error handle login user ${error.message}`);
    }
  };
  const dateNowFilter = new Date().toISOString().slice(0, 10);
  const weekDates = getWeekFromDate(dateNowFilter).map((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const loadData = async () => {
    try {
      setLoading(true);
      if (decodedToken === null) {
      } else {
        const response = await habit.getHabitByIdUser(
          decodedToken && decodedToken ? decodedToken.sub : ""
        );
        const resAPI = await getNewsID();
        if (resAPI.status == "ok") {
          setApiData(resAPI.articles);
        }
        if (response.data) {
          const filteredDataUnfinished = response.data.filter(
            (item) =>
              item.date === dateNowFilter && item.status === "unfinished"
          );
          const filteredDataFinished = response.data.filter(
            (item) => item.date === dateNowFilter && item.status === "finished"
          );
          const filteredDataWeekDates = response.data.filter(
            (item) =>
              weekDates.includes(item.date) && item.status === "finished"
          );
          const allDataFinished = response.data.filter(
            (item) => item.status === "finished"
          );
          setFilteredDataWeekDates(filteredDataWeekDates);
          setTask({
            finished: filteredDataFinished.length,
            unfinished: filteredDataUnfinished.length,
            dataFinish: allDataFinished,
          });
        }
      }
    } catch (error) {
      console.log(`error from load data habits page ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [decodedToken]);

  const tasksPerDay = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };
  filteredDataWeekDates.forEach((item) => {
    const day = getDayName(item.date);
    tasksPerDay[day] += 1;
  });
  const taskCounts = [
    tasksPerDay["Sunday"],
    tasksPerDay["Monday"],
    tasksPerDay["Tuesday"],
    tasksPerDay["Wednesday"],
    tasksPerDay["Thursday"],
    tasksPerDay["Friday"],
    tasksPerDay["Saturday"],
  ];
  const dataMounth = tasksPerMonth(task.dataFinish || []);

  const taskCountsPerYear = tasksPerYear(task.dataFinish || []);

  const currentYear = new Date().getFullYear();
  const labels = Array.from({ length: 6 }, (_, i) =>
    (currentYear + i).toString()
  );
  // Menyiapkan data untuk tahun-tahun tersebut
  const dataYears = labels.map((year) => {
    const counts = taskCountsPerYear[year] || Array(12).fill(0);
    return counts.reduce((total, num) => total + num, 0);
  });
  const taskCountsMouth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        <button
          id="sidebarToggleTop"
          onClick={toggleSidebar}
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
                  <button
                    onClick={() => setOpenModalLogin(true)}
                    className="btn btn-primary"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="btn btn-secondary"
                  >
                    Register
                  </button>
                </span>
              </div>
            )}
          </li>
        </ul>
      </nav>
      {decodedToken === null ? (
        <div class="container mt-5 h-100">
          <div class="row">
            <div class="col-md-6 offset-md-3 text-center">
              <p>
                Silakan login terlebih dahulu untuk melanjutkan. Jika Anda belum
                memiliki akun, silakan daftar untuk membuat akun baru.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div id="content">
          <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>
            <div className="row gap-4">
              <div className="col-md-4">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Task Today</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-around align-items-center">
                      <div className="text-center">
                        <div className="display-4 text-success">
                          <i className="bi bi-check-circle-fill me-2"></i>
                          {task.finished}
                        </div>
                        <p className="text-muted">Completed</p>
                      </div>
                      <div className="text-center">
                        <div className="display-4 text-danger">
                          <i className="bi bi-x-circle-fill me-2"></i>
                          {task.unfinished}
                        </div>
                        <p className="text-muted">Uncompleted</p>
                      </div>
                    </div>
                    <hr />
                    <p className="text-muted mb-0 text-center">
                      You have tasks to complete today.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-7 ">
                <div
                  className="row  flex-nowrap"
                  style={{
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",

                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {loading ? (
                    <div class="card" aria-hidden="true">
                      <div class="card-body">
                        <h5 class="card-title placeholder-glow">
                          <span class="placeholder col-6"></span>
                        </h5>
                        <p class="card-text placeholder-glow">
                          <span class="placeholder col-7"></span>
                          <span class="placeholder col-4"></span>
                          <span class="placeholder col-4"></span>
                          <span class="placeholder col-6"></span>
                          <span class="placeholder col-8"></span>
                        </p>
                        <a
                          class="btn btn-primary disabled placeholder col-6"
                          aria-disabled="true"
                        ></a>
                      </div>
                    </div>
                  ) : apiData.length > 0 ? (
                    apiData.map((data, index) => (
                      <div className="col-md-5" key={index}>
                        <CardNews
                          author={data.author}
                          publishedAt={data.publishedAt}
                          source={data.source}
                          title={data.title}
                          url={data.url}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-md-5 p-4 mx-auto ">
                      <div
                        className="alert alert-warning "
                        role="alert"
                        style={{
                          maxWidth: "500px",
                          margin: "auto",
                          marginTop: "20px",
                        }}
                      >
                        <h4 className="alert-heading">API Limit Reached!</h4>
                        <p>
                          Sorry, the API has reached its limit. Please try again
                          later.
                        </p>
                        <hr />
                        <p className="mb-0">
                          You may need to wait a while before trying again or
                          contact support.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4">
                <Bar
                  data={{
                    labels: [
                      "Senin",
                      "Selasa",
                      "Rabu",
                      "Kamis",
                      "Jumat",
                      "Sabtu",
                      "Minggu",
                    ],
                    datasets: [
                      {
                        label: "Statistik Mingguan",
                        data: taskCounts,
                        borderWidth: 1,
                      },
                    ],
                  }}
                  type="bar"
                />
              </div>
              <div className="col-md-4">
                <Bar
                  data={{
                    labels: taskCountsMouth,
                    datasets: [
                      {
                        label: "Statistik Bulanan",
                        data: dataMounth,
                        borderWidth: 1, // Ketebalan border
                        backgroundColor: "rgba(75, 192, 192, 0.2)", // Warna latar belakang
                        borderColor: "rgba(75, 192, 192, 1)", // Warna border
                      },
                    ],
                  }}
                  options={{}}
                />
              </div>
              <div className="col-md-4 ">
                <Bar
                  data={{
                    labels: labels, // Tahun-tahun
                    datasets: [
                      {
                        label: "Statistik Tahunan", // Label data
                        data: dataYears,
                        borderWidth: 1, // Ketebalan border
                        backgroundColor: "rgba(75, 192, 192, 0.2)", // Warna latar belakang
                        borderColor: "rgba(75, 192, 192, 1)", // Warna border
                      },
                    ],
                  }}
                  options={{}}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {openModal && (
        <ModalComp title={"Sign Up"} isOpen={(state) => setOpenModal(state)}>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <form onSubmit={handlRegisterUser}>
            <div className="form-group">
              <label for="fullname">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                placeholder="Enter your full name"
                required
                name="name"
                onChange={handleonChange}
              />
            </div>

            <div className="form-group">
              <label for="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                onChange={handleonChange}
              />
            </div>

            <div className="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
                required
                name="password"
                onChange={handleonChange}
              />
            </div>

            <button type="submit" class="btn btn-primary" disabled={loading}>
              {loading ? (
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </ModalComp>
      )}
      {openModalLogin && (
        <ModalComp
          title={"Sign In"}
          isOpen={(state) => setOpenModalLogin(state)}
        >
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <form onSubmit={handleLoginUser}>
            <div className="form-group">
              <label for="fullname">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                placeholder="Enter your full name"
                required
                name="name"
                onChange={handleonChange}
              />
            </div>

            <div className="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                required
                name="password"
                onChange={handleonChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </ModalComp>
      )}
      <footer className="sticky-footer bg-white mt-5">
        <div className="container my-auto">
          <div className="copyright text-center my-auto">
            <span>Copyright &copy; Your Website 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
