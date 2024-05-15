const todosContainer = document.querySelector('.todos--container');
const newBlockBtn = document.querySelector('.new--block');

// это что то вроде хука которй работает с локальным стораджем
// тоесть пригимает данные превращает их в JSON потом сохраняет по ключу которой задали
// так же он получает данные в таким же обрахом
class useLocalstorage {
    static getData(key) {
        const data = localStorage.getItem(key)
        if (!data) {
            return null
        }
        return JSON.parse(data) || null
    }

    static setData(key, data) {
        const jsonData = JSON.stringify(data)
        localStorage.setItem(key, jsonData);
    }
}

// основной массив получает из хранилища если нет то присваевает ему пустой массив
let todoTitle = useLocalstorage.getData('todos')|| []

// функция которая превращает div в input чтобы редактировать
function changeInput(e) {
    const span = e.target;
    const text = span.innerText;
    const parentList = span.closest('.todo__list');
    if (!parentList) {
        return
    }
    const parentId = parentList.dataset.id;

    const input = document.createElement('input');
    input.classList.add('todo__item--input')
    input.type = 'text';
    input.value = text == "Untitled" ? '' : text;
    span.replaceWith(input);

    // тут меняет значение из инпута потом сохраняет его
    function updateTodoValue(event) {
        const newValue = event.target.value;
        const newSpan = e.target;
        newSpan.classList.add('todo__item--title');
        newSpan.textContent = newValue;
        input.replaceWith(newSpan);
        const updateTodos = todoTitle.find( i => i.id ==parentId)
        const todoItem = updateTodos.todos.find(i=> i.id == newSpan.dataset.id)
        todoItem.title = newValue
        renderBlocks()
    }

    // слущатели событий
    input.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            input.blur();
            updateTodoValue(event);
        }
    });

    input.addEventListener('blur', updateTodoValue)
    input.focus();
}


// эта функция такая же но ана зименят title todoBlock
function changeTodoTitleName (e, id) {
    const div = e.target;
    const text = div.innerText;
    const input = document.createElement('input');
    input.classList.add('todo__title--input')
    input.type = 'text';
    input.value = text == "Untitled" ? '' : text;
    div.replaceWith(input);

    function updateTodoValue(event) {
        const newValue = event.target.value;
        const newSpan = e.target;
        newSpan.classList.add('todo--title');
        newSpan.textContent = newValue;
        input.replaceWith(newSpan);
        const updateTodos = todoTitle.find( i => i.id == id)
        updateTodos.name = newValue
        renderBlocks()
    }

    input.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            input.blur();
            updateTodoValue(event);
        }
    });
    input.addEventListener('blur', updateTodoValue)
    input.focus();
}

//  я добавлял его до рефакторинга там был и чекбокс но потом удалил но функицю оставил может понадбиться
function updateTodoStatus(event, id) {
    console.log(id)
    const updatedTodo = todos.find(todo => todo.id === id);
    updatedTodo.checked = !updatedTodo.checked;
    // renderTodos()
}


// эта функция по классу  находит родительский блок (todoBlock) потом достает
// из датасета id и удаляет из массива todoTitle[parentId].todos
function deleteTodo(event, id) {
    const parentList = event.target.closest('.todo__list');
    if (!parentList) {
        return
    }
    const parentId = parentList.dataset.id;
    const updateTodos = todoTitle.find( i => i.id == parentId)
    const todoItem = updateTodos.todos.filter(i => i.id !== id)
    updateTodos.todos = todoItem
    console.log(todoItem)
    renderBlocks()
}

// эта функция по классу  находит родительский блок (todoBlock) потом достает
// из датасета id и удаляет из массива todoTitle
function deleteValue(id){
    todoTitle = todoTitle.filter(item => item.id !== id)
    renderBlocks()
}

// это функиц создает ноавй туду элемент разметки
function createTodoElement({title, id, checked}) {
    const item =
        `<div class="todo__item" data-id="${id}">
                <div class="todo--item__actions container">
                    <button onclick="deleteTodo(event, '${id}')" class="delete__todo">
                    <svg width="10" height="10" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.59236 0.360001L0 3.95236L1.8344 5.78675L6.36943 10.3982L1.8344 14.9332L0 16.6912L3.59236 20.36L5.42675 18.5256L10.0382 13.9141L14.5732 18.5256L16.3312 20.36L20 16.6912L18.1656 14.9332L13.5541 10.3982L18.1656 5.78675L20 3.95236L16.3312 0.360001L14.5732 2.1944L10.0382 6.72943L5.42675 2.1944L3.59236 0.360001Z" fill="black"/>
                    </svg>

                </button>
                </div>
            <div>
                <span 
                    class="todo__item--title" 
                    data-id=${id}
                    onclick="changeInput(event)">
                    ${title == "" ? "Untitled" : title}
                </span>
            </div>
        </div>`
    return item

}

// функция которая добавляет новый элемент в todoTitle
function newTodoBlock (){
    alert('мобильный!')
    const newTodo = {
        id: Date.now().toString(),
        name: 'Untitled',
        todos: [],
    };
    todoTitle.push(newTodo)
    renderBlocks()
}

// функция которая добавляет новый элемент в todoTitle[id].todos
function addNewTodo(event, id) {
    const newTodo = {
        id: Date.now().toString(),
        title: 'Untitled',
        checked: false
    };
    const newTodos = todoTitle.find(items => items.id == id)

    newTodos.todos.push(newTodo);
    renderBlocks();
}

// функция которая рендерит блоки все по массиву todoTitle и он используется для ререндера после какого-то изменения
// что бы дом синхронно работал с массивом которым мы мутируем я бы мог добавить observer в todoTitle и
// там renderBlocks испольвать чтобы не прописывать рендерблокс на каждое событие и функцию измение в д DOM

function renderBlocks() {
    todosContainer.innerHTML = ``
    todoTitle.forEach(items => {
        const todoBlock = document.createElement('div');
        todoBlock.classList.add('todo--block');
        todoBlock.innerHTML = `
           <div class="todo--block-header">
                <span 
                    class="todo__title"
                    onclick="changeTodoTitleName(event, '${items.id}')"
                    ondblclick="deleteValue('${items.id}')" >${items.name}
                </span> 
                <button class="delete__todo" onclick="deleteValue('${items.id}')">
                    <svg width="15" height="15" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.9936 0C12.2447 0 9.99571 2.24904 9.99571 4.99786H4.99786C2.24904 4.99786 0 7.24689 0 9.99571H34.985C34.985 7.24689 32.736 4.99786 29.9871 4.99786H24.9893C24.9893 2.24904 22.7402 0 19.9914 0H14.9936ZM4.99786 14.9936V39.0333C4.99786 39.583 5.39769 39.9829 5.94745 39.9829H29.0875C29.6373 39.9829 30.0371 39.583 30.0371 39.0333V14.9936H25.0393V32.4861C25.0393 33.8855 23.9397 34.985 22.5403 34.985C21.1409 34.985 20.0414 33.8855 20.0414 32.4861V14.9936H15.0435V32.4861C15.0435 33.8855 13.944 34.985 12.5446 34.985C11.1452 34.985 10.0457 33.8855 10.0457 32.4861V14.9936H5.04784H4.99786Z" fill="black"/>
                    </svg>
                </button>
            </div>
            
            <div class="todo__list" data-id="${items.id}">
                ${renderTodos(items.todos)}
            </div>
            <input
                type="button" 
                class="button add-button"
                id="${items.id}"
                onclick="addNewTodo(event, '${items.id}')" value="+" />
                 
        `;

        todosContainer.appendChild(todoBlock);
    });
    useLocalstorage.setData('todos', todoTitle)
}

renderBlocks();

// эта функиця уже рендерит todolist внутри todoBlock так как здесь map мне пришлось
// испольвать join потомучто он возвращает новый массив значений
function renderTodos(items) {
    return items.map(todo => createTodoElement(todo)).join('')

}

// это слушатель который создает новый todoList и это единсвенное статичная
// кнопка котрая с самого начала есть в DOM
newBlockBtn.addEventListener('click', newTodoBlock)








