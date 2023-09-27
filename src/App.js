import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faPen,
  faTrash,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  // Tasks (ToDo List) State
  const [toDo, setToDo] = useState([]);

  // Temp State
  const [newTask, setNewTask] = useState('');
  const [updateData, setUpdateData] = useState('');

  // Function to sort tasks by creation date
  const sortByCreationDate = (tasks) => {
    return tasks.slice().sort((a, b) => {
      return a.id < b.id ? 1 : -1;
    });
  };

  // Function to sort completed tasks by completion date
  const sortByCompletionDate = (tasks) => {
    return tasks.slice().sort((a, b) => {
      return a.status && !b.status ? 1 : -1;
    });
  };

  // Add task
  const addTask = () => {
    if (newTask) {
      let num = toDo.length + 1;
      let newEntry = { id: num, title: newTask, status: false };
      setToDo([...toDo, newEntry]);
      setNewTask('');
    }
  };

  // Delete task
  const deleteTask = (id) => {
    let newTasks = toDo.filter((task) => task.id !== id);
    setToDo(newTasks);
  };

  // Mark task as done or completed
  const markDone = (id) => {
    const newTasks = toDo.map((task) => {
      if (task.id === id) {
        return { ...task, status: !task.status };
      }
      return task;
    });
    setToDo(newTasks);
  };

  // Cancel update
  const cancelUpdate = () => {
    setUpdateData('');
  };

  // Change task for update
  const changeTask = (e) => {
    let newEntry = {
      id: updateData.id,
      title: e.target.value,
      status: updateData.status ? true : false,
    };
    setUpdateData(newEntry);
  };

  // Update task
  const updateTask = () => {
    let filterRecords = [...toDo].filter((task) => task.id !== updateData.id);
    let updatedObject = [...filterRecords, updateData];
    setToDo(updatedObject);
    setUpdateData('');
  };

  // Function to reset all tasks
  const resetTodos = () => {
    setToDo([]);
  };

  // Function to save TODO data to localStorage
  const saveTodoData = (data) => {
    localStorage.setItem('todoData', JSON.stringify(data));
  };

  // Function to load TODO data from localStorage
  const loadTodoData = () => {
    const data = localStorage.getItem('todoData');
    return data ? JSON.parse(data) : [];
  };

  // Load TODO data from localStorage when the app starts
  useEffect(() => {
    const savedData = loadTodoData();
    if (savedData.length) {
      setToDo(savedData);
    }
  }, []);

  // Update TODO data whenever there's a change
  useEffect(() => {
    saveTodoData(toDo);
  }, [toDo]);

  // Function to render active tasks
  const renderActiveTasks = () => {
    return sortByCreationDate(toDo)
      .filter((task) => !task.status) // Filter out completed tasks
      .map((task, index) => (
      <div className='taskslist'>
        <div className="col taskBg" key={task.id}>
          <div className={task.status ? 'done' : ''}>
            <span className="taskNumber">{index + 1}</span>
            <span className="taskText">{task.title}</span>
          </div>
          <div className="iconsWrap">
            <span
              onClick={() => markDone(task.id)}
              title="Completed / Not Completed"
            >
              <FontAwesomeIcon icon={faCircleCheck} />
            </span>
            {!task.status && (
              <span
                title="Edit"
                onClick={() =>
                  setUpdateData({
                    id: task.id,
                    title: task.title,
                    status: task.status ? true : false,
                  })
                }
              >
                <FontAwesomeIcon icon={faPen} />
              </span>
            )}
            <span onClick={() => deleteTask(task.id)} title="Delete">
              <FontAwesomeIcon icon={faTrash} />
            </span>
          </div>
        </div>
        </div>
      ));
  };

  // Function to render completed tasks
  const renderCompletedTasks = () => {
    return sortByCompletionDate(toDo)
      .filter((task) => task.status) // Filter out active tasks
      .map((task, index) => (
        <div className='taskslist'>
        <div className="col taskBg" key={task.id}>
          <div className={task.status ? 'done' : ''}>
            <span className="taskNumber">{index + 1}</span>
            <span className="taskText">{task.title}</span>
          </div>
          <div className="iconsWrap">
            <span
              onClick={() => markDone(task.id)}
              title="Completed / Not Completed"
            >
              <FontAwesomeIcon icon={faCircleCheck} />
            </span>
            <span onClick={() => deleteTask(task.id)} title="Delete">
              <FontAwesomeIcon icon={faTrash} />
            </span>
          </div>
        </div>
        </div>
      ));
  };

  return (
    <div className="container App">
      <br />
      <br />
      <h1>My ToDos List</h1>
      <br />
      <br />
      {updateData && updateData ? (
        <>
          <div className="row inputbox">
            <div className="col">
              <input
                value={updateData && updateData.title}
                onChange={(e) => changeTask(e)}
                className="form-control form-control-lg"
              />
            </div>
            <div className="col-auto">
              <button
                className="btn btn-lg btn-success mr-4 updatebtn"
                onClick={updateTask}
              >
                Update
              </button>
              <button
                className="btn btn-lg btn-warning cancelbtn"
                onClick={cancelUpdate}
              >
                Cancel
              </button>
            </div>
          </div>
          <br />
        </>
      ) : (
        <>
          <div className="row">
            <div className="col">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="form-control form-control-lg"
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-lg addbtn" onClick={addTask}>
                Add Task
              </button>
            </div>
          </div>
          <br />
        </>
      )}
      <div className="reset-button-container">
        <button className="btn btn-danger" onClick={resetTodos}>
          Reset
          <FontAwesomeIcon icon={faUndo} className="ml-2" />
        </button>
      </div>

      {/* Show active tasks */}
      {toDo && toDo.length ? renderActiveTasks() : 'No tasks...'}

      {/* Show completed tasks */}
      {toDo &&
        toDo.some((task) => task.status) && (
          <div className="completed-tasks">
            <h3>Completed Tasks</h3>
            {renderCompletedTasks()}
          </div>
        )}
    </div>
  );
}

export default App;
