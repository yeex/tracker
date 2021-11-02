import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route} from "react-router-dom"
import Header  from "./components/Header"
import Footer from "./components/Footer"
import Tasks from "./components/Tasks"
import AddTask from "./components/AddTask"
import About from "./components/About"

function App() {
  // var name = "Mozay"
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer);
    }
    getTasks();
  }, [])

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }


  // Toggle tasks
  const tasksToggle = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  // Add task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data]); // Clone the tasks array and add new data 

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task}
    // setTasks([...tasks, newTask])
  }

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleReminder = async (id) => {

    const taskToToggle = await tasksToggle(id)
    const updateTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updateTask)
    })

    const data = await res.json()
    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task))
  }
  return (
    <Router>
          <div className="container">
            <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/> 
            <Route path='/' exact render={() => (
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {/* <h1>Hello, { name }</h1> */}
                {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No tasks available'}
              </>
            )} />
            <Route path='/about' component={About} />
            <Footer />
          </div>
    </Router>
  );

}

export default App;
