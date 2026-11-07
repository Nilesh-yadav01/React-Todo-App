import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Learn React.js",
    description: "Practice React components and hooks",
    priority: "High",
    date: "2026-11-08",
    completed: false,
  },
  {
    id: 2,
    title: "Complete portfolio",
    description: "Add projects to my portfolio",
    priority: "Medium",
    date: "2026-11-09",
    completed: true,
  },
  {
    id: 3,
    title: "Practice JavaScript",
    description: "Revise array methods and promises",
    priority: "Low",
    date: "2026-11-10",
    completed: false,
  },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("taskflow-tasks");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [date, setDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.completed) ||
        (filter === "Completed" && task.completed);

      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDate("");
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (editingId !== null) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title: title.trim(),
                description: description.trim(),
                priority,
                date,
              }
            : task
        )
      );
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        priority,
        date,
        completed: false,
      };

      setTasks((prev) => [newTask, ...prev]);
    }

    resetForm();
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDate(task.date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const clearCompleted = () => {
    if (window.confirm("Delete all completed tasks?")) {
      setTasks((prev) => prev.filter((task) => !task.completed));
    }
  };

  const getPriorityClass = (value) => {
    return value.toLowerCase();
  };

  const formatDate = (value) => {
    if (!value) return "No deadline";

    return new Date(value + "T00:00:00").toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="app-wrapper">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✓</span>
          <span>TaskFlow</span>
        </div>

        <p className="sidebar-heading">MENU</p>

        <button
          className={`side-link ${filter === "All" ? "active" : ""}`}
          onClick={() => setFilter("All")}
        >
          <span>▦</span> All Tasks
          <span className="side-count">{tasks.length}</span>
        </button>

        <button
          className={`side-link ${filter === "Pending" ? "active" : ""}`}
          onClick={() => setFilter("Pending")}
        >
          <span>◷</span> Pending
          <span className="side-count">{pending}</span>
        </button>

        <button
          className={`side-link ${filter === "Completed" ? "active" : ""}`}
          onClick={() => setFilter("Completed")}
        >
          <span>✓</span> Completed
          <span className="side-count">{completed}</span>
        </button>

        <div className="sidebar-bottom">
          <div className="profile-circle">U</div>
          <div>
            <strong>My Workspace</strong>
            <small>Personal Account</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>My Workspace</h2>
            <p>Manage your daily tasks efficiently.</p>
          </div>

          <div className="today-date">
            <span>📅</span>
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <p className="welcome-small">YOUR PERSONAL TASK MANAGER</p>
            <h1>Stay focused. Get things done.</h1>
            <p>Organize your work and achieve your daily goals.</p>
          </div>
          <div className="welcome-icon">✦</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">▦</div>
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
            <small>All your tasks</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>
            <p>Pending Tasks</p>
            <h2>{pending}</h2>
            <small>Need your attention</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>Completed Tasks</p>
            <h2>{completed}</h2>
            <small>Successfully done</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">↗</div>
            <p>Progress</p>
            <h2>{progress}%</h2>
            <div className="mini-progress">
              <div style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        <section className="task-layout">
          <div className="task-form-card">
            <div className="section-title">
              <h3>{editingId !== null ? "Edit Task" : "Create New Task"}</h3>
              <span>✚</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Task Title *</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                className="form-control"
                placeholder="Add task details..."
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="form-row">
                <div>
                  <label>Priority</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <label>Due Date</label>
                  <input
                    className="form-control"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="add-button">
                {editingId !== null ? "Update Task" : "+ Add Task"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel Editing
                </button>
              )}
            </form>
          </div>

          <div className="task-list-card">
            <div className="task-list-header">
              <div>
                <h3>My Tasks</h3>
                <p>You have {pending} tasks remaining</p>
              </div>

              <button
                className="clear-button"
                onClick={clearCompleted}
                disabled={completed === 0}
              >
                Clear Completed
              </button>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search your tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              {["All", "Pending", "Completed"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "selected" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="tasks-container">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div>📝</div>
                  <h4>No tasks found</h4>
                  <p>Add a new task or change your search.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    className={`task-item ${task.completed ? "task-done" : ""}`}
                    key={task.id}
                  >
                    <button
                      className={`check-button ${task.completed ? "checked" : ""}`}
                      onClick={() => toggleTask(task.id)}
                      aria-label="Toggle task completion"
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="task-info">
                      <h4>{task.title}</h4>
                      {task.description && (
                        <p>{task.description}</p>
                      )}

                      <div className="task-meta">
                        <span className={`priority ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="task-date">
                          📅 {formatDate(task.date)}
                        </span>
                      </div>
                    </div>

                    <div className="task-actions">
                      <button
                        title="Edit task"
                        onClick={() => editTask(task)}
                      >
                        ✎
                      </button>
                      <button
                        title="Delete task"
                        onClick={() => deleteTask(task.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <footer className="footer">
          © 2026 TaskFlow. Built with React.js
        </footer>
      </main>
    </div>
  );
}

export default App;