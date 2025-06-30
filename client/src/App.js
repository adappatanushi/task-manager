import React, { useState, useEffect } from 'react';
import Login from './login';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';


function App() {
  const [user, setUser] = useState(localStorage.getItem('user') || '');
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());


  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    const now = new Date();
    const taskDate = now.toLocaleDateString();
    const taskTime = now.toLocaleTimeString();
    await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        date: taskDate,
        time: taskTime,
        reminder,
      }),
    });
    setTitle('');
    setDescription('');
    setReminder('');
    fetchTasks();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.reminder && !task.notified) {
          const reminderTime = new Date(task.reminder);
          if (now >= reminderTime) {
            if (Notification.permission === 'granted') {
              new Notification(`🔔 Reminder: ${task.title}`, {
                body: task.description,
              });
            } else {
              alert(`🔔 Reminder: ${task.title}`);
            }
            task.notified = true;
          }
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  if (!user) {
    return <Login onLogin={(username) => { setUser(username); localStorage.setItem('user', username); }} />;
  }

  return (
    <div className="App">
      <header>
        <h1>🗂️ Task Organizer</h1>
      </header>

      <section className="calendar-section">
  <h2>📅 Choose a Date for Your Task</h2>
  <div className="calendar-container">
    <Calendar
      onChange={setSelectedDate}
      value={selectedDate}
      className="custom-calendar"
    />
  </div>
  <div className="selected-date">
    Selected Date: {selectedDate.toDateString()}
  </div>
</section>


      <section className="form">
        <h2>Add New Task</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input type="datetime-local" value={reminder} onChange={(e) => setReminder(e.target.value)} />
        <button onClick={addTask}>Add Task</button>
      </section>

      <section className="task-list">
        <h2>Your Tasks</h2>
        {tasks.map(task => (
          <div key={task.id} className="task">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-meta">
              📅 {task.date} 🕒 {task.time}
            </div>
            {task.reminder && (
              <div className="task-reminder">
                ⏰ Reminder: {new Date(task.reminder).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </section>
      <footer>
  <button
    className="logout"
    onClick={() => {
      setUser('');
      localStorage.removeItem('user');
    }}
  >
    Logout
  </button>
</footer>


    </div>
  );
}

export default App;
