import {getCurrentTasks} from './index.js'
const deleteIcon = `<svg stroke='currentColor' fill='currentColor' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'>
      <path d='M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z'
      />
    </svg>`

const indexedDB =
  window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB

const NAME_DATABASE = 'TaskDatabase'
const NAME_STORE = 'task'

const request = indexedDB.open(NAME_DATABASE, 1)

request.onerror = function (event) {
  console.error('An error occurred with IndexedDB')
  console.error(event)
}

request.onupgradeneeded = function () {
  const db = request.result
  const store = db.createObjectStore(NAME_STORE, {keyPath: 'id'})
  store.createIndex('task-title', ['title'], {unique: false})
  store.createIndex('task-and-checked', ['title', 'checked'], {unique: false})
}

request.onsuccess = function () {
  const IDB = getIDBData('readwrite', 'wtf')
  const task = IDB.index('task-title')
  const checked = IDB.index('task-and-checked')
}

const getIDBData = (mode, msg) => {
  const db = request.result
  const transaction = db.transaction(NAME_STORE, mode)
  const store = transaction.objectStore(NAME_STORE)
  transaction.addEventListener('complete', () => {
    console.log(msg ? msg : "")
  })
  return store
}

export const createTask = ({id, title, checked}) => {
  const IDB = getIDBData('readwrite', 'created successful.')
  IDB.add({id, title, checked})
}

export const allTasks = () => {
  const IDB = getIDBData('readonly', 'All data was read :).')
  return IDB.getAll().onsuccess = function (event) {
    const stats = document.getElementById('stats')
    getCurrentTasks(event.target.result)
    if (event.target.result.length > 0) {
      stats.innerHTML = ''
      stats.appendChild(showStats(event.target.result))
      listingData(event.target.result)
    } else {
      stats.innerHTML = `<span>No tasks found ✔️ </span>`
      listingData(event.target.result)
    }
  }
}

export const updateTask = ({id, title, checked}) => {
  const IDB = getIDBData('readwrite', 'update task correctly.')
  IDB.put({id, title, checked})
}

export const deleteTask = (id) => {
  const IDB = getIDBData('readwrite', 'delete task correctly.')
  IDB.delete(id)
}

const listingData = tasks => {
  const fragment = document.createDocumentFragment()
  const list = document.getElementById('list')

  list.innerHTML = ''
  tasks.map((task) => {
    const label = document.createElement('label')
    const input = document.createElement('input')
    const button = document.createElement('button')
    const article = document.createElement('article')
    const span = document.createElement('span')

    article.classList.add('list-container__item')

    article.setAttribute('id', task.id)
    input.setAttribute('type', 'checkbox')
    input.setAttribute('name', 'check')
    input.classList.add('check')
    input.checked = task.checked
    button.setAttribute('id', 'delete')
    button.setAttribute('title', 'Delete task')

    label.textContent = task.title.length < 45 ? task.title : `${task.title.substring(0, 45)}...`
    label.style = task.checked ? 'text-decoration: line-through; color: #848484;' : 'text-decoration: none; color: #ffffff;'
    label.appendChild(input)
    label.appendChild(span)
    button.innerHTML = deleteIcon

    article.appendChild(label)
    article.appendChild(button)
    return fragment.appendChild(article)
  })
  list.appendChild(fragment)
}

const showStats = (tasks) => {
  const span = document.createElement('span')
  const filter = tasks.filter(t => t.checked === true)
  span.textContent = `Pending Tasks: ${tasks.length} - Completed: ${filter.length}`
  return span
}

