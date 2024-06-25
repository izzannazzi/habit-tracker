import React, { useEffect, useState } from "react";
import Todos from "../components/Todos";
import HabitCard from "../components/HabitCard";
import { convertDateFormat, getDateNow } from "../utils/dateFormater";
import { useJwt } from "react-jwt";
import { Habits } from "../services/db/habits";
import ModalComp from "../components/ModalComp";
import { confirmSwal } from "../utils/SweetAlert";
import swal from "sweetalert";
import { NotificationHandler } from "../utils/notification";

const HabitsPage = () => {
  const [loading, setLoading] = useState(false);
  const [dataForm, setDataForm] = useState({
    id: null,
    description: "",
    habit: "",
    id_user: "",
    time: "",
    status: "",
    date: "",
    dateNow: "",
  });
  const { decodedToken, isExpired, reEvaluateToken } = useJwt(
    sessionStorage.getItem("auth")
  );
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [data, setData] = useState([]);
  const [deletedCard, setDeletedCard] = useState("");
  const dateNow = getDateNow();
  const habit = new Habits();
  const [filterData, setFilterData] = useState("");
  const dateNowFilter = filterData
    ? convertDateFormat(filterData)
    : new Date().toISOString().slice(0, 10);
  const [daysStrike, setDaysStrike] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await habit.getHabitByIdUser(
        decodedToken && decodedToken ? decodedToken.sub : ""
      );
      if (response.data) {
        const filteredData = response.data.filter(
          (item) => item.date === dateNowFilter && item.status === "unfinished"
        );

        const filteredDaysStrike = response.data.filter(
          (item) => item.status === "finished"
        );

        setDaysStrike(filteredDaysStrike);
        setData(filteredData);
      }
    } catch (error) {
      console.log(`error from load data habits page ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
    return () => {
      // clean
    };
  }, [decodedToken, deletedCard, dateNowFilter]);

  const handleUpdatedHabit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await habit.updateHabit(dataForm.id, dataForm);
      if (response.statusCode === 200) {
        confirmSwal(
          "Update successful",
          "Your habit has been successfully updated.",
          false
        );

        setDeletedCard(response);
        setUpdateModalOpen(false);
      }
    } catch (error) {
      console.log(`error handleupdate habit ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleonChange = (event) => {
    const { name, value } = event.target;

    setDataForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFinishHabit = async (data) => {
    swal({
      title: "Are you sure?",
      text: "Once Finish, you  this habit!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const response = await habit.updateHabit(data.id, data);
        setDeletedCard(data.id);

        swal("Success!", "Your habit has been successfully Finish.", {
          icon: "success",
        });
        setDeletedCard(response);
      } else {
        swal("Cancelled", "Your habit is not Finish.", "info");
      }
    });
    try {
    } catch (error) {
      console.log(`error handleFinishHabit  ${error.message}`);
    }
  };
  const handleDeleteHabit = async (id) => {
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you won't be able to recover this habit!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          const response = await habit.deleteHabit(id);
          swal("Success!", "Your habit has been successfully deleted.", {
            icon: "success",
          });
          setDeletedCard(response);
        } else {
          swal("Cancelled", "Your habit is safe.", "info");
        }
      });
    } catch (error) {
      console.log(`error handle delete habit ${error.message}`);
    }
  };
  const notificationHandler = new NotificationHandler();
  const convertdateAndTime = data.map((item) => {
    return {
      date: item.date,
      time: item.time,
      desc: item.description,
      title: item.habit,
    };
  });
  convertdateAndTime.map((data) => {
    notificationHandler.scheduleNotification(
      data.date,
      data.time,
      `Reminder for your habit '${data.title}': ${data.desc}`
    );
  });

  return (
    <div id="content-wrapper" class="d-flex flex-column">
      <div style={{ backgroundImage: "url('/images/bg-habits-banner.png')" }}>
        <div
          className="container  mx-auto row text-black align-items-center justify-content-center flex-col p-3 "
          style={{ minHeight: "15%" }}
        >
          <div className="col">
            <h2 className="fw-semibold">
              Today's :<span className="opacity-50 ">{dateNow}</span>
            </h2>
          </div>
        </div>
      </div>
      <Todos
        dateNow={filterData || dateNow}
        addHabit={(id) => setDeletedCard(id)}
        setDate={(date) => setFilterData(date)}
      >
        <div className="row mt-4 px-3 container-fluid">
          {loading ? (
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "auto",
                padding: "20px",
              }}
              className=" border d-flex flex-wrap justify-content-center align-items-center bg-dark rounded-sm m-2"
              aria-hidden="true"
            >
              <img src="..." class="card-img-top" alt="..." />
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
          ) : data.length > 0 ? (
            data.map((habit, index) => (
              <div className="col-md-4" key={index}>
                <HabitCard
                  deleteId={(id) => handleDeleteHabit(id)}
                  updateModal={(state) => setUpdateModalOpen(state)}
                  data={habit}
                  deleted={(id) => setDeletedCard(id)}
                  updateddata={(data) => setDataForm(data)}
                  finishedHabit={(data) =>
                    handleFinishHabit({ ...data, status: "finished" })
                  }
                />
              </div>
            ))
          ) : (
            <div className="col text-center mt-5">
              <div className="alert alert-warning" role="alert">
                <i className="bi bi-emoji-frown fs-1"></i>
                <h4 className="alert-heading">Data Kosong</h4>
                <p>
                  Belum ada data yang tersedia saat ini. Tambahkan data baru
                  untuk memulai.
                </p>
                <hr />
              </div>
            </div>
          )}
        </div>
      </Todos>
      {updateModalOpen && (
        <ModalComp
          title={"Update Habit"}
          isOpen={(state) => setUpdateModalOpen(state)}
        >
          <form onSubmit={handleUpdatedHabit}>
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
                  value={dataForm.habit}
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
                  value={dataForm.date}
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
                  value={dataForm.time}
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
                  value={dataForm.description}
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
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </ModalComp>
      )}
    </div>
  );
};

export default HabitsPage;
