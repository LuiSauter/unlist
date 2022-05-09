const deleteIcon = `<svg stroke='currentColor' fill='currentColor' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'>
      <path d='M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z'
      />
    </svg>`

const taskForm = document.getElementById('form')
const input = document.getElementById("task")
const list = document.getElementById('list')
const stats = document.getElementById('stats')

let allData = []

const uid = () => {
  const head = Date.now().toString(36)
  const tail = Math.random().toString(36).substring(2)
  return head + tail
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask()
})

const addTask = () => {
  allData.push({id: uid(), title: input.value, checked: false})
  input.value = ""
  listingData()
  stats.innerHTML = ""
  stats.appendChild(showStats())
}

const listingData = () => {
  const fragment = document.createDocumentFragment()
  list.innerHTML = ""
  allData.map(task => {
    const label = document.createElement('label')
    const input = document.createElement('input')
    const button = document.createElement('button')
    const article = document.createElement('article')
    const span = document.createElement('span')

    article.classList.add('task-container')

    article.setAttribute('id', task.id)
    input.setAttribute('type', 'checkbox')
    input.setAttribute('name', 'check')
    input.classList.add('check')
    input.checked = task.checked
    button.setAttribute('id', 'delete')

    label.textContent = task.title
    label.appendChild(input)
    label.appendChild(span)
    button.innerHTML = deleteIcon

    article.appendChild(label)
    article.appendChild(button)
    fragment.appendChild(article)
  })
  list.appendChild(fragment)
}

list.addEventListener('click', (e) => {
  if (allData.length > 0) {
    // update task (checked)
    if (e.target.nodeName === 'INPUT') {
      const id = e.target.parentElement.parentElement.id
      return allData.forEach((task, index) => {
        if (task.id === id) {
          allData[index] = {id, title: task.title, checked: !task.checked}
        }
        stats.innerHTML = ""
        stats.appendChild(showStats())
      })
    }
    // Delete task
    if (e.target.nodeName === 'svg' || e.target.nodeName === 'path' || e.target.nodeName === 'BUTTON') {
      let id = ""
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
      allData = allData.filter(task => task.id !== id)
      stats.innerHTML = ""
      stats.appendChild(showStats())
      listingData()
    }
  }
})

const showStats = () => {
  const span = document.createElement('span')
  const filter = allData.filter(t => t.checked === true)
  span.textContent = `Pending Tasks: ${allData.length} - Completed: ${filter.length}`
  return span
}

