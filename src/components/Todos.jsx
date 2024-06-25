import React, { useEffect, useState } from "react";
import "../assets/css/style.css";
import ModalComp from "./ModalComp";
import { getDateNow } from "../utils/dateFormater";
import { Habits } from "../services/db/habits";
import { useJwt } from "react-jwt";
import { confirmSwal } from "../utils/SweetAlert";

const Todos = ({ children, dateNow, addHabit, setDate }) => {
  const { decodedToken } = useJwt(sessionStorage.getItem("auth"));
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    dateNow: getDateNow(),
    habit: "meditate",
    date: "",
    time: "",
    description: "",
    status: "unfinished",
  });
  const [errMessage, setErrMessage] = useState("");
  const habit = new Habits();

  useEffect(() => {
    const convertedDateNow = convertDateFormat(dateNow);
    const week = getWeekFromDate(convertedDateNow);
    setWeekDates(week);
    const dayIndex = getDayFromDate(dateNow);
    setCurrentDay(dayIndex);
  }, [dateNow]);

  const convertDateFormat = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const getWeekFromDate = (dateNow) => {
    const startDate = new Date(dateNow);
    const dayOfWeek = startDate.getDay();

    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - dayOfWeek);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      week.push(currentDate.toLocaleDateString("id-ID"));
    }
    return week;
  };

  const getDayFromDate = (dateString) => {
    const dateParts = dateString.split("/");
    const date = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
    return date.getDay();
  };

  const handleonChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddhabit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await habit.addhabit(
        data,
        decodedToken && decodedToken.sub ? decodedToken.sub : ""
      );

      if (res.statusCode === 200) {
        confirmSwal("Successfully added a new habit", res.message);
        setModalOpen(false);
        addHabit(res.data);
      } else if (res.statusCode === 400) {
        setErrMessage(res.message);
        setTimeout(() => {
          setErrMessage("");
        }, 3000);
      }
    } catch (error) {
      console.log(`Error handleAddhabit: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <>
      <div className="row">
        <div className="col md-12">
          <div className="d-flex align-items-center text-black justify-content-between px-3 mt-2">
            <h3>Todo</h3>
            <div>
              {weekDates.map((date, index) => (
                <button
                  key={index}
                  value={date}
                  className={`btn rounded-circle btn-fixed-size ${
                    currentDay === index
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setDate(date)}
                >
                  {dayLabels[index]}
                </button>
              ))}
            </div>
            <div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setModalOpen(true)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {children}
      {modalOpen && (
        <ModalComp isOpen={(state) => setModalOpen(state)} title={"Add Habit"}>
          {errMessage && <p className="text-danger">{errMessage}</p>}
          <form onSubmit={handleAddhabit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="habit" className="form-label">
                  Habit
                </label>
                <select
                  className="form-control"
                  id="habit"
                  name="habit"
                  onChange={handleonChange}
                >
                  <option value="meditate">Meditate</option>
                  <option value="running">Running</option>
                  <option value="read books">Read Books</option>
                  <option value="write journal">Write Journal</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="date"
                  onChange={handleonChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="time" className="form-label">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  className="form-control"
                  id="time"
                  onChange={handleonChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="deskripsi" className="form-label">
                  Deskripsi
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  onChange={handleonChange}
                  style={{ minHeight: "100px", resize: "vertical" }}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  " Submit"
                )}
              </button>
            </div>
          </form>
        </ModalComp>
      )}
    </>
  );
};

export default Todos;
