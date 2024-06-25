import swal from "sweetalert";

const confirmSwal = (title = "Login Success!", message, reload) => {
  swal({
    title: title,
    text: message,
    icon: "success",
    buttons: {
      confirm: {
        text: "OK",
        value: true,
        visible: true,
        classNameName: "",
        closeModal: true,
      },
    },
  }).then((willRefresh) => {
    if (willRefresh) {
      reload && window.location.reload();
      return false;
    }
  });
};
const WarningConfirmSwal = (title, text, action, successText, rejectText) => {
  swal({
    title: title,
    text: text,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      action().then((res) => {
        if (res && res.statusCode === 200) {
          swal(successText, {
            icon: "success",
          });
        } else {
          swal("Error", "Failed to delete habit.", "error");
        }
      });
    } else {
      swal(rejectText);
    }
  });
};
export { confirmSwal, WarningConfirmSwal };
