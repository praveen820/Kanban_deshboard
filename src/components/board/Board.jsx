import React from "react";
import "../../stylesheet/Board/board.scss";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { reorderTaskDragDrop } from "../../features/boards/boardSlice";
import {
  closeAllModals,
  closeViewTaskModal,
  openModal,
} from "../../features/global/modalSlice";
import Sidebar from "../sideBar/SideBar";
import Column from "../column/Column";
import ActionBoardModal from "../modal/boardModal/ActionBoardModal";
import AddTaskModal from "../modal/taskModal/AddTaskModal";
import AddBoardModal from "../modal/boardModal/AddBoardModal";
import EditBoardModal from "../modal/boardModal/EditBoardModal";
import EditTaskModal from "../modal/taskModal/EditTaskModal";
import { DragDropContext } from "@hello-pangea/dnd";
import ViewTaskModal from "../modal/taskModal/ViewTaskModal";

const Board = () => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = Array.isArray(boards) && boards?.find((board) => board?.active === true);

  // Modals
  const deleteBoardModal = useSelector((state) => state.modal.deleteBoardModal);
  const clearBoardModal = useSelector((state) => state.modal.clearBoardModal);
  const resetBoardsModal = useSelector((state) => state.modal.resetBoardsModal);
  const editBoardModal = useSelector((state) => state.modal.editBoardModal);
  const addBoardModal = useSelector((state) => state.modal.addBoardModal);
  const addTaskModal = useSelector((state) => state.modal.addTaskModal);
  const viewTaskModal = useSelector((state) => state.modal.viewTaskModal);
  const editTaskModal = useSelector((state) => state.modal.editTaskModal);
  const deleteTaskModal = useSelector((state) => state.modal.deleteTaskModal);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(reorderTaskDragDrop(result));
  };
  return (
    <>
      <div className="sidebar-board-outer">
        <Sidebar />
        <div className="board">
          {activeBoard?.columns?.length > 0 ? (
            <>
              <>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  {Array.isArray(activeBoard?.columns) && activeBoard?.columns?.map((column, colIndex) => (
                    <Column
                      key={column.id}
                      column={column}
                      boardID={activeBoard.id}
                      colIndex={colIndex}
                    />
                  ))}
                </DragDropContext>
              </>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="column__new bg-new-column"
                onClick={() => dispatch(openModal("editBoardModal"))}
              >
                <span>+ New Column</span>
              </motion.button>
            </>
          ) : (
            <div className="board__empty">
              <h1 className="board__empty-text">
                This board is empty. Create a new column to get started.
              </h1>
              <div
                className=" btn-primary-l board__empty__add"
                style={{ "--width": "174px" }}
                onClick={() => dispatch(openModal("editBoardModal"))}
              >
                + Add a column
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modals */}

      {clearBoardModal.open && <ActionBoardModal action="clear" />}
      {deleteBoardModal.open && <ActionBoardModal action="delete" />}
      {resetBoardsModal.open && <ActionBoardModal action="reset" />}
      {deleteTaskModal.open && <ActionBoardModal action="deleteTask" />}
      {editBoardModal.open && <EditBoardModal />}
      {addBoardModal.open && <AddBoardModal />}
      {addTaskModal.open && <AddTaskModal />}
      {viewTaskModal.open && (
        <ViewTaskModal
          handleClose={() => {
            dispatch(closeAllModals());
            dispatch(closeViewTaskModal());
          }}
        />
      )}
      {editTaskModal.open && <EditTaskModal />}
    </>
  );
};

export default Board;
