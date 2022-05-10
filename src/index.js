import './styles/normalize.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/aside.css'
import './styles/main.css'
import maleLogo from './assets/to-do-list.svg'

import {createTask, allTasks, updateTask, deleteTask} from './indexedDB.js'
import {uid} from './helper.js'


let allData = []

export const getCurrentTasks = (data) => {
  return allData = data
}

if (typeof window !== 'undefined') {
  const taskForm = document.getElementById('form')
  const input = document.getElementById('task')
  const list = document.getElementById('list')
  const logo = document.getElementById('logo')

  logo.src = maleLogo

  window.addEventListener('load', () => {
    allTasks()
  })

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault()
    if (input.value !== '') {
      addTask()
    }
  })

  const addTask = () => {
    createTask({id: uid(), title: input.value, checked: false})
    //allTasks().addEventListener('success', event => console.log(event.target.result))
    allTasks()
    input.value = ''
  }

  list.addEventListener('click', (e) => {
    // update task (checked)
    if (allData.length > 0) {
      if (e.target.nodeName === 'INPUT') {
        const id = e.target.parentElement.parentElement.id
        return allData.forEach((task, index) => {
          if (task.id === id) {
            updateTask({id, title: task.title, checked: !task.checked})
            allData[index] = {id, title: task.title, checked: !task.checked}
          }
          allTasks()
        })
      }
      // Delete task
      if (e.target.nodeName === 'svg' || e.target.nodeName === 'path' || e.target.nodeName === 'BUTTON') {
        let id = ''
        switch (e.target.nodeName) {
          case 'path':
            id = e.target.parentElement.parentElement.parentElement.id
            break
          case 'svg':
            id = e.target.parentElement.parentElement.id
            break
          case 'BUTTON':
            id = e.target.parentElement.id
            break
        }
        deleteTask(id)
        allData = allData.filter(task => task.id !== id)
        allTasks()
      }
    }
  })
}
