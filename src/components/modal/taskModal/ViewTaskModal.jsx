import React, { useRef, useState } from "react";
import "../../../stylesheet/Modal/TaskModal/taskModal.scss";
// import { ReactComponent as Elipsis } from "../../../assets/Icons/icon-vertical-ellipsis.svg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import {
  closeViewTaskModal,
  openEditTaskModal,
  closeAllModals,
  openDeleteTaskModal,
} from "../../../features/global/modalSlice";
import Subtask from "../../task/Subtask";
import "../../../stylesheet/Extra/DropdownSettings.scss";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
// import { motion } from "framer-motion";
import DropdownStatus from "../../extra/DropdownStatus";

const ViewTaskModal = ({ handleClose }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const dispatch = useDispatch();
  const task = useSelector((state) => state.modal.viewTaskModal.task);
  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const elipsisRef = useRef(null);
  const wrapperRef = useOutsideClick(handleCloseSettings, elipsisRef);

  const getFinishedSubTasks = () => {
    let finishedSubTasks = 0;
    Array.isArray(task?.subTasks) && task?.subTasks?.forEach((subtask) => {
      if (subtask.isDone) {
        finishedSubTasks++;
      }
    });
    return finishedSubTasks;
  };

  const closeModal = () => {
    dispatch(closeViewTaskModal());
  };
  return (
    <Modal closeModal={closeModal} open={true} onClose={closeModal}>
      <Box
        className="view-task"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "none",
          outline: "none",
        }}
      >
        <div className="view-task__header | flex">
          <h2 className="view-task__header__title">{task?.name}</h2>
          <div className="view-tastk__settings">
            <div
              className="view-task__header__icon"
              style={{ cursor: "pointer" }}
              ref={elipsisRef}
              onClick={() => {
                setOpenSettings(!openSettings);
              }}
            >
              {/* <Elipsis /> */}
            </div>
            {openSettings && (
              <div className="dropdown-settings__task" ref={wrapperRef}>
                <div
                  className="dropdown-settings__item"
                  onClick={() => {
                    dispatch(closeAllModals());
                    dispatch(openEditTaskModal(task));
                  }}
                >
                  Edit Task
                </div>
                <div
                  className="dropdown-settings__item"
                  onClick={() => {
                    dispatch(closeAllModals());
                    dispatch(openDeleteTaskModal(task));
                  }}
                >
                  Delete Task
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="view-task__description">{task.description}</p>

        <div className="view-task__subtasks">
          <p>
            Subtasks ({getFinishedSubTasks()} of {task.subTasks.length})
          </p>
          <div className="view-task__subtasks__list">
            {Array.isArray(task?.subTasks) && task?.subTasks?.map((subtask, index) => (
              <Subtask
                subtaskID={subtask.id}
                boardID={task.boardID}
                taskID={task.id}
                columnID={task.columnID}
                key={index}
              />
            ))}
          </div>
        </div>
        <div className="view-task__status">
          <p>Current Status</p>
          <DropdownStatus click={handleCloseSettings} task={task} />
        </div>
      </Box>
    </Modal>
  );
};

export default ViewTaskModal;
