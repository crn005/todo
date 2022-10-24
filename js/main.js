// находим элементы на странице
const form = document.getElementById('form')
const taskInput = document.getElementById('taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

// повесим слушатель на форму
form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask); // повесим слушатель на весь лист
tasksList.addEventListener('click', doneTask); // повесим слушатель на весь лист

let tasks = [];



// если в localStorage по ключу tasks есть данные
// если вернет строку то это true
if (localStorage.getItem('tasks')) {
    // к нам приходит просто строка, и нам нужно спарсить ее в JS массив 
    // сохраним его в массив tasks
    tasks = JSON.parse(localStorage.getItem('tasks'));
    // нам нужно отобразить их на странице
    // пройтись по массиву и отрендерить каждый элемент

    tasks.forEach(function (task) {
        renderTasks(task)
    }
    )
}


checkEmptyList();

/* if(localStorage.getItem('tasksHTML'))
{
    tasksList.innerHTML = localStorage.getItem('tasksHTML');
} */


function addTask(event) {

    // отменим перегрузку формы
    event.preventDefault()
    // достаем текст задачи из поля ввода
    const taskText = taskInput.value;

    // сохраним задачу со статусом в массив
    // создадим объект, который будет описывать задачу 
    const newTask = {
        id: Date.now(), // тек время в ммс, для id
        text: taskText, // текст задачи
        done: false // статус выполнености        
    };
    // добавим объект в массив с задачами 
    tasks.push(newTask);

    saveToLocalStorage();

    // если задача не выполнена, то присваиваем правый класс, если выполнена, то левый

    // очищаем поле ввода и возвращаем на него фокус ввода
    taskInput.value = ""
    taskInput.focus()

    // проверяем, есть ли задачи
    // возвращает коллекцию дочерних тегов, если они есть. length - количество этих элементов
    /* if (tasksList.children.length > 1) { // 1 потому что есть <li id="emptyList"
        emptyList.classList.add('none') // присвоим класс none, который скрывает emptyList из css display: none
    } */
    //saveHTMLtoLS();
    renderTasks(newTask);
    checkEmptyList();
}

// удаление задачи
function deleteTask(event) {
    // свойство у нужной нам кнопки data-action="delete", 
    //выбирается через .dataset.action 
    // проверяем если клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return; // если  не по кнопке удалить, то выходим из функции
    // иначе else
    // closest ищет родителей селектора элемент.closest('селектор')
    // т.е. <li class="list-group-item" выше нашего элемента
    const parentNode = event.target.closest('.list-group-item')
    const id = Number(parentNode.id); // приведение типов
    // находим индекс задачи в массиве
    /* const index = tasks.findIndex(function(task){
        if(task.id === id) // если тек id равен id из parenNode. Нестрогое стравнение "1" и 1
        {
            return true // то вернем тру
        }                
        // можно ак сократить код выше
        //return tasks.id === id // вернет true если если найдет
    })
 */
    //сократим вышестоящий код до одной стрелочной функции 
    //onst index = tasks.findIndex((task)=> task.id === id);
    // удаляем задачу из массива с задачами
    //tasks.splice(index, 1)
    // либо можно фильтрацией
    /* tasks = tasks.filter(function (task) {
        /* if (task.id === id) {
            return false // не попадут в новый массив
        }
        else {
            return true // попадут в новый массив
        }
        // можно сократить код
        return task.id !== id; // если не равно, то тру и попадает в новый массив
     }) */

    // сократим код выше до стрелочной функции
    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();
    // удалим ее со страницы 
    parentNode.remove()

    // если в li всего один элемент (т.е. список задач пуст)
    // то у emptyList-а удаляем класс none, чтобы он опять отобразился 
    /*  if (tasksList.children.length == 1) {
         emptyList.classList.remove('none')
     } */
    //saveHTMLtoLS();
    checkEmptyList();

}

// отмечаем задачу завершенной
function doneTask(event) {
    if (event.target.dataset.action != "done") return;
    // else
    const parentNode = event.target.closest('.list-group-item')

    const id = Number(parentNode.id);

    // task будет ссылка на найденный элемент массива 
    const task = tasks.find(function (task) {
        if (task.id === id) {
            return true
        }
    })

    task.done = !task.done;

    console.log(task)


    // внутри найденной ноды нужно найти span, т.е. от li идем вниз
    const taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')
    //saveHTMLtoLS();
    saveToLocalStorage();
}

// сохранение разметки в localStorage, антипаттерн 
/* function saveHTMLtoLS(){
    localStorage.setItem('tasksHTML', tasksList.innerHTML)
} */


// проверка Список дел пуст. Нужно запускать каждый раз, когда меняются данные
function checkEmptyList() {
    // если кол-во элементов равно 0, то нам нужно отобразить блок Список дел пуст
    //console.log(tasks)
    if (tasks.length === 0) {
        console.log('11111111');
        const emptyListElement = `
        <li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
		</li>
        `;
        tasksList.insertAdjacentHTML('afterbegin', emptyListElement);
    }
    if (tasks.length > 0) {
        console.log('22222222');
        // если задачи есть, то надо удалить Список дел пуст
        const emptyListEl = document.querySelector('#emptyList');
        // если он не пуст, то удаляем, если пуст, то возрвращаем null 
        emptyListEl ? emptyListEl.remove('#emptyList') : null;
    }
}

// сохраняем в localStorage
function saveToLocalStorage() {
    // в JSON формате 
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(task) {
    // если задача не выполнена, то присваиваем правый класс, если выполнена, то левый
    const cssClass = tasks.done ? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новой  задачи 
    // newTasks.text - это текст нашей новой задачи 
    // newTask.id - id задачи зададим в качестве id тега li 
    const taskHTML = `
 <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
 <span class="${cssClass}">${task.text}</span>
 <div class="task-item__buttons">
  <button type="button" data-action="done" class="btn-action">
      <img src="./img/tick.svg" alt="Done" width="18" height="18">
  </button>
  <button type="button" data-action="delete" class="btn-action">
      <img src="./img/cross.svg" alt="Done" width="18" height="18">
  </button>
 </div>
 </li>`
    // добавим разметку на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}




