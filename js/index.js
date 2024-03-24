
const BACKEND_ROOT_URL = 'http://localhost:3001'
import { Todos } from "./class/Todos.js";

const todos = new Todos(BACKEND_ROOT_URL)

const list = document.querySelector('ul')
const input = document.querySelector('input')

input.disabled = true

/*create separate function for rendering task*/
const renderTask = (task) => {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-group-item')
    li.setAttribute('date-key', task.getId().toString())
    li.innerHTML = task.getText();
    renderLink(li, task.getId());
    //renderSpan(li, task.getText());
    list.append(li)
  }

  /*create separate function for rendering span*/
const renderSpan = (li, text) => {
    const span = li.appendChild(document.createElement('span'))
    span.innerHTML = text
  }
  
  /*create separate function for rendering link*/
  const renderLink = (li, id) => {
    const a = li.appendChild(document.createElement('a'))
    a.innerHTML = "<i class='bi bi-trash'></i>"
    a.setAttribute('style', 'float:right')
    a.addEventListener('click', (event) => {
      todos.removeTask(id).then((removed_id) => {
        const li_to_remove = document.querySelector(`[date-key="${removed_id}"]`)
        if (li_to_remove) {
          list.removeChild(li_to_remove)
        }
      }).catch((error) => {
        alert(error)
      })
    })
  }

//create separate function for getting tasks
const getTasks = () => {
    todos.getTasks().then((tasks) => {
            tasks.forEach(task => {
            renderTask(task)
        })
        input.disabled = false
    }).catch((error) => {
        alert(error)
    })
  }
  /*create separate function for saving task */
  
  const saveTask = async (task) => {
    try {
      const json = JSON.stringify({ description: task })
      const response = await fetch(BACKEND_ROOT_URL + '/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      })
      return response.json()
    } catch (error) {
      alert('Error saving task' + error.message)
    }
  } 
  
  /*key press enter event*/
  input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        const task = input.value.trim()
        if (task!=='') {
          todos.addTask(task).then((task) => {
            renderTask(task)
            input.value = ''
            input.focus()                        
        })
      }    
    }
  });
  
  getTasks()