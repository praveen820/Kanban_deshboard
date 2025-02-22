import React from "react";
import "../../stylesheet/Task/subtask.scss";
import { useSelector, useDispatch } from "react-redux";
import { toggleSubTask } from "../../features/boards/boardSlice";
const Subtask = ({ subtaskID, columnID, boardID, taskID }) => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state?.boards);
  const board = Array.isArray(boards?.boards) && boards?.boards?.find((board) => board?.id === boardID);
  const column = Array.isArray(board?.columns) && board?.columns?.find((column) => column?.id === columnID);
  const task = Array.isArray(column?.tasks) && column?.tasks?.find((task) => task?.id === taskID);
  const subtask = Array.isArray(task?.subTasks) && task?.subTasks?.find((subtask) => subtask?.id === subtaskID);

  const toggleSubTaskHandler = () => {
    dispatch(
      toggleSubTask({
        boardID: subtask?.boardID,
        columnID: subtask?.columnID,
        taskID: subtask?.taskID,
        subTaskID: subtask?.id,
      })
    );
  };

  return (
    <div
      onClick={() => {
        toggleSubTaskHandler();
      }}
      className={`subtask ${
        subtask.isDone ? "subtask-bg__done" : "subtask-bg__not-done"
      }`}
    >
      <div className="subtask__checkbox flex">
        <input
          className="subtask__checkbox-input"
          type="checkbox"
          onChange={() => {}}
          checked={subtask.isDone}
        />
      </div>
      <div
        className={`subtask__name ${
          subtask.isDone ? "subtask__title-done" : "subtask__title-not-done"
        }`}
      >
        {subtask?.name}
      </div>
    </div>
  );
};

export default Subtask;
