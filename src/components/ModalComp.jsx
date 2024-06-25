import React, { useState } from "react";

const ModalComp = ({ children, title, isOpen }) => {
  return (
    <>
      <div
        className="modal "
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{
          display: "block",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          overflow: "hidden",
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {title}
              </h1>
              <button
                onClick={() => isOpen(false)}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalComp;
