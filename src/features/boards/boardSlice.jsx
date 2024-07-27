import { createSlice, nanoid } from "@reduxjs/toolkit";
import boards from "../../app/app.json";
import { randomHexColor } from "./boarderHelper";

const initialState = {
  boards: boards.boards,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (state, action) => {
      const newID = nanoid();
      const { boardName } = action.payload;
      const { columnNames } = action.payload;
      const columns = Array.isArray(columnNames) && columnNames?.map((name) => {
        return {
          id: nanoid(),
          boardID: newID,
          color: randomHexColor(),
          name: name,
          tasks: [],
        };
      });
      const newBoard = {
        id: newID,
        name: boardName,
        columns: columns,
      };
      state.boards.push(newBoard);
    },
    dragAndDropBoard: (state, action) => {
      const { source, destination } = action.payload;
      const board = state.boards[source.index];
      Array.isArray(state?.boards) && state?.boards?.splice(source.index, 1);
      Array.isArray(state?.boards) && state?.boards?.splice(destination.index, 0, board);
    },

    deleteBoard: (state, action) => {
      const boardID = action?.payload;
      state.boards = Array.isArray(state?.boards) && state?.boards?.filter((board) => board.id !== boardID);
      // Set active board to the first board in the array
      state.boards[0].active = true;
    },
    editBoard: (state, action) => {
      const { columns, boardID, boardName } = action.payload;
      const board = Array.isArray(state?.boards) && state?.boards?.find((board) => board.id === boardID);
      if (board) {
        board.name = boardName;
        board.columns = columns;
      }
    },

    clearBoard: (state, action) => {
      const board = Array.isArray(state?.boards) && state?.boards?.find((board) => board?.id === action?.payload);
      if (board) {
        board.columns = [];
      }
    },
    setActiveBoard: (state, action) => {
      // First remove active from all boards
      Array.isArray(state?.boards) && state?.boards?.forEach((board) => {
        board.active = false;
      });
      const board = Array.isArray(state?.boards) && state?.boards?.find((board) => board.id === action.payload);
      if (board) {
        board.active = true;
      }
    },

    // Columns
    addColumn: {
      reducer: (state, action) => {},
      // Column has color which will be generated randomly
      prepare: (name, boardID) => {
        return {
          payload: {
            id: nanoid(),
            name,
            boardID,
            color: randomHexColor(),
            tasks: [],
          },
        };
      },
    },
    deleteColumn: (state, action) => {},
    editColumn: (state, action) => {},

    // Tasks
    addTask: (state, action) => {
      const { boardID, columnID, taskName, taskDescription, subTaskNames } =
        action.payload;
      const board = Array.isArray(state?.boards) && state?.boards?.find((b) => b.id === boardID);
      const column = Array.isArray(board?.columns) && board?.columns?.find((c) => c.id === columnID);
      const newTaskID = nanoid();
      const newSubtasks = Array.isArray(subTaskNames) && subTaskNames?.map((name) => {
        return {
          id: nanoid(),
          taskID: newTaskID,
          columnID: columnID,
          boardID: boardID,
          name: name,
          isDone: false,
        };
      });

      const newTask = {
        id: newTaskID,
        columnID: columnID,
        boardID: boardID,
        name: taskName,
        description: taskDescription,
        subTasks: newSubtasks,
      };

      column.tasks.push(newTask);
    },

    deleteTask: (state, action) => {
      const { task } = action.payload;
      const board = Array.isArray(state?.boards) && state?.boards?.find((b) => b.id === task.boardID);
      const column = Array.isArray(board?.columns) && board?.columns?.find((c) => c.id === task.columnID);

      // Remove the task from the column
      column.tasks = Array.isArray(column?.tasks) && column?.tasks?.filter((t) => t.id !== task.id);
    },
    editTask: (state, action) => {
      const {
        boardID,
        oldColumnID,
        columnID,
        task,
        taskName,
        taskDescription,
        subTasks,
      } = action.payload;
      const board = Array.isArray(state?.boards) && state?.boards?.find((b) => b.id === boardID);
      const oldColumn = Array.isArray(board?.columns) && board?.columns?.find((c) => c.id === oldColumnID);
      const newColumn = Array.isArray(board?.columns) && board?.columns?.find((c) => c.id === columnID);
      // const stateTask = Array.isArray(oldColumn?.tasks) && oldColumn?.tasks?.find((t) => t.id === task.id);

      let newSubTasks = [];
      let newTask = [];

      // Check if its the same column
      if (oldColumnID === columnID) {
        newTask = {
          ...task,
          name: taskName,
          description: taskDescription,
          subTasks: subTasks,
        };
        // Replace the task in the column
        oldColumn.tasks = Array.isArray(oldColumn?.tasks) && oldColumn?.tasks?.map((t) => {
          if (t.id === task.id) {
            return newTask;
          } else {
            return t;
          }
        });
      } else {
        newSubTasks = Array.isArray(subTasks) && subTasks?.map((subTask) => {
          return {
            ...subTask,
            columnID: newColumn.id,
          };
        });

        newTask = {
          ...task,
          name: taskName,
          description: taskDescription,
          subTasks: newSubTasks,
          columnID: columnID,
        };

        // Remove the task from the old column
        oldColumn.tasks = Array.isArray(oldColumn?.tasks) && oldColumn?.tasks?.filter((t) => t.id !== task.id);
        // Add the task to the new column
        newColumn?.tasks?.push(newTask);
      }
    },
    reorderTaskDragDrop: (state, action) => {
      const { source, destination } = action.payload;
      const activeBoard = Array.isArray(state?.boards) && state?.boards?.find((b) => b.active === true);
      // destion.dropableId is the index of the column
      const sourceColumn = activeBoard?.columns[source.droppableId];
      const destinationColumn = activeBoard?.columns[destination.droppableId];
      const task = sourceColumn.tasks[source.index];
      Array.isArray(sourceColumn?.tasks) && sourceColumn?.tasks?.splice(source.index, 1);
      Array.isArray(destinationColumn?.tasks) && destinationColumn?.tasks?.splice(destination.index, 0, task);
      // const intDestId = parseInt(destination.droppableId);
      task.columnID = destinationColumn.id;
      // Iterate through subtasks and change the columnID
     Array.isArray( task.subTasks) &&  task.subTasks?.forEach((s) => (s.columnID = destinationColumn.id));
    },
    changeTaskColumn: (state, action) => {
      const { boardID, oldColumnID, newColumnID, taskID } = action.payload;
      const board = Array.isArray(state?.boards) && state?.boards?.find((b) => b.id === boardID);
      const oldColumn = Array.isArray(board?.columns) && board?.columns?.find((c) => c.id === oldColumnID);
      const newColumn = Array.isArray(board?.columns) && board?.columns?.find((c) => c.id === newColumnID);
      const task = Array.isArray(oldColumn?.tasks) && oldColumn?.tasks?.find((t) => t.id === taskID);
      oldColumn.tasks = Array.isArray(oldColumn?.tasks) && oldColumn?.tasks?.filter((t) => t.id !== taskID);
      task.columnID = newColumnID;
      // Iterate through subtasks and change the columnID
     Array.isArray( task.subTasks) &&  task.subTasks?.forEach((s) => (s.columnID = newColumnID));
      newColumn.tasks?.push(task);
    },

    // SubTasks
    addSubTask: (state, action) => {},

    toggleSubTask: (state, action) => {
      const board = Array.isArray(state?.boards) && state?.boards?.find((b) => b.id === action.payload.boardID);
      const column = Array.isArray(board?.columns) && board?.columns?.find(
        (c) => c.id === action.payload.columnID
      );
      const task = Array.isArray(column?.tasks) && column?.tasks?.find((t) => t.id === action.payload.taskID);
      const subTask = Array.isArray(task?.subTasks) && task?.subTasks?.find(
        (s) => s.id === action.payload.subTaskID
      );
      subTask.isDone = !subTask.isDone;
    },
    editSubTask: (state, action) => {
      const { taskID, columnID, subTaskID, title } = action.payload;
      const board = state.boards[state.activeBoardIndex];
      const column = Array.isArray(board?.columns) && board?.columns?.find((c) => c.id === columnID);
      if (column) {
        const task = Array.isArray(column?.tasks) && column?.tasks?.find((t) => t.id === taskID);
        if (task) {
          const subTask =  Array.isArray(task?.subTasks) && task?.subTasks?.find((s) => s.id === subTaskID);
          if (subTask) {
            subTask.title = title;
          }
        }
      }
    },
  },
});

export const finishedSubTasksOfTask = (state, boardID, columnID, taskID) => {
  const board = Array.isArray(state?.boards?.boards) && state?.boards?.boards?.find((b) => b.id === boardID);
  const column = Array.isArray(board?.columns) && board?.columns?.find((c) => c.id === columnID);
  const task = Array.isArray(column?.tasks) && column?.tasks?.find((t) => t.id === taskID);
  return Array.isArray(task?.subTasks) && task?.subTasks?.filter((s) => s.isDone).length;
};

export const findActiveBoard = (state) => {
  // Find the board that has the attribute active = true
  return Array.isArray(state.boards.boards) && state.boards.boards?.find((b) => b.active);
};

export const {
  addBoard,
  deleteBoard,
  editBoard,
  setActiveBoard,
  addColumn,
  deleteColumn,
  editColumn,
  addTask,
  dragAndDropBoard,
  deleteTask,
  editTask,
  changeTaskColumn,
  addSubTask,
  deleteSubTask,
  reorderTaskDragDrop,
  editSubTask,
  toggleSubTask,
  clearBoard,
} = boardsSlice.actions;

export default boardsSlice.reducer;
