import "./App.css";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as XLSX from "xlsx";

function App() {
  const [tasks, setTasks] = useState([{ id: 1, text: "Task", status: "Todo" }]);

  function addTask(text) {
    const newTask = {
      id: tasks.length + 1,
      text,
      status: "Todo",
    };
    setTasks([...tasks, newTask]);
  }

  function updateTask(id, text) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function exportToExcel() {
    const data = tasks.map((task) => ({
      text: task.text,
      status: task.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    XLSX.writeFile(workbook, "tasks.xlsx");
  }

  function onDragEnd(result) {
    if (!result.destination) return; // Drop outside the droppable area

    const { source, destination } = result;
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
  }

  return (
    <div className="task-list">
      <div className="header">
        <h1>My Tasks</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todo">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="task-card"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <p className="task-text">{task.text}</p>
                      <div className="task-buttons">
                        <button
                          onClick={() =>
                            updateTask(
                              task.id,
                              prompt("Update task:", task.text)
                            )
                          }
                        >
                          Update
                        </button>
                        <button onClick={() => deleteTask(task.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={exportToExcel}>Export Excel</button>&nbsp;&nbsp;
      <button onClick={() => addTask("New task")}>Add Task</button>
    </div>
  );
}

export default App;
