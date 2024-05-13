const todoList = document.querySelector('.todo__list');
const addTodoBtn = document.getElementById('addTodo');

class useLocalstorage{
    static getData (key){
        const data = localStorage.getItem(key)
        return JSON.parse(data)
    }
    static setData (key,data ){
        const jsonData = JSON.stringify(data)
        localStorage.setItem(key, jsonData);
    }
}


let todos =   useLocalstorage.getData('todos') || [];


function changeInput (e){
    const span = e.target;
    const text = span.innerText;




    const input = document.createElement('input');
    input.classList.add('todo__item--input')
    input.type = 'text';
    input.value = text == "Untitled" ? '' : text ;
    span.replaceWith(input);


    function updateTodoValue(event){
        const newValue = event.target.value;
        const newSpan = e.target;
        newSpan.classList.add('todo__item--title');
        newSpan.textContent = newValue;
        input.replaceWith(newSpan);
        const updateTodos= todos.find(i => i.id == newSpan.dataset.id);
        updateTodos.title = newValue
        renderTodos();
    }


    input.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            input.blur(); // Снимаем фокус с элемента, если нажата клавиша Enter
            updateTodoValue(event); // Вызываем функцию обновления значения
        }
    });


    input.addEventListener('blur', updateTodoValue)
    // input.addEventListener('dblclick', deleteTodo(event, e.target.dataset.id))
    input.focus();
}

function updateTodoStatus(event, id) {
    console.log(id)
    const updatedTodo = todos.find(todo => todo.id === id);
    updatedTodo.checked = !updatedTodo.checked ;
    renderTodos()
}

function deleteTodo (event, id){
    todos = todos.filter(i => i.id !== id)
    renderTodos()
}


// <input
//     type="checkbox"
//     ${checked ? 'checked' : ''}
//     onChange="updateTodoStatus(event, '${id}')"
// />


function createTodoElement({ title, id , checked}) {
    const span = document.createElement('span');
    span.dataset.id = id
    span.classList.add('todo__item');
    const item = `
                    <div class="todo--item__actions container">
                 
                          <button onclick="deleteTodo(event, '${id}')" class="delete__todo">x</button>
                    </div>
                    <div>
                          <span 
                            class="todo__item--title" 
                            data-id=${id}>
                            ${title == ""? "Untitled": title }
                        </span>
                    </div>
                    `
    span.innerHTML = item;
    return span
}


function addNewTodo() {
    const newTodo = {
        id: Date.now().toString(),
        title: 'Untitled',
        checked: false
    };
    todos.push(newTodo);
    renderTodos()
}

addTodoBtn.addEventListener('click', function () {
    addNewTodo();
});

document.addEventListener('DOMContentLoaded', function () {
    renderTodos();
});

function renderTodos() {
    todoList.innerHTML = ''

    useLocalstorage.setData('todos', todos)
    todos.forEach((todo) => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });

    const todoItemTitle = document.querySelectorAll('.todo__item--title')
    todoItemTitle.forEach((span) => {
        span.addEventListener('click', changeInput);
    })


}








