document.addEventListener('DOMContentLoaded', function () {
    const userTableBody = document.getElementById('user-table-body');
    const body = document.getElementsByTagName('body')[0];

    // Функция для создания и добавления модального окна "Edit" для пользователя
    function createEditModal(user) {
        const editModal = document.createElement('div');
        editModal.id = `editModal${user.id}`;
        editModal.className = 'modal fade';
        editModal.tabIndex = '-1';
        editModal.role = 'dialog';
        editModal.setAttribute('aria-hidden', 'true');

        editModal.innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit user</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="form-edit" >
                            <label for="edit_id">ID</label>
                            <input type="text" name="id" id="edit_id" value="${user.id}" readonly><br>

                            <label for="edit_firstname">First name</label>
                            <input type="text" name="firstName" id="edit_firstname" value="${user.firstName}" required><br>

                            <label for="edit_lastName">Last name</label>
                            <input type="text" name="lastName" id="edit_lastName" value="${user.lastName}" required><br>

                            <label for="edit_age">Age</label>
                            <input type="number" pattern="\\d*" name="age" id="edit_age" value="${user.age}" required><br>

                            <label for="edit_email">Email</label>
                            <input type="email" name="email" id="edit_email" value="${user.email}" required><br>

                            <label for="edit_password">Password</label>
                            <input type="password" name="password" id="edit_password" value="${user.password}" required><br>

                            <label for="edit_role">Role</label>
                            <select id="edit_role" name="role">
                                <option value="ROLE_USER">USER</option>
                                <option value="ROLE_ADMIN" ${user.roles.some(role => role.name === 'ROLE_ADMIN') ? 'selected' : ''}>ADMIN</option>
                            </select><br>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="button-edit">Edit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        body.appendChild(editModal);
    }

    // Функция для обработки события нажатия на кнопку "Edit"
    function handleEditClick(user) {
        // Создаем и добавляем модальное окно "Edit" для данного пользователя
        createEditModal(user);

        // Открываем модальное окно "Edit"
        const editModal = document.getElementById(`editModal${user.id}`);
        $(editModal).modal('show');

        // Находим кнопку "Edit" внутри модального окна
        const editButton = editModal.querySelector('.button-edit');

        // Добавляем обработчик события клика на кнопку "Edit"
        editButton.addEventListener('click', function () {

            const userId = document.getElementById('edit_id').value;
            // Ваш JSON-объект пользователя
            const editedUser = {
                id: userId,
                firstName: document.getElementById('edit_firstname').value,
                lastName: document.getElementById('edit_lastName').value,
                age: document.getElementById('edit_age').value,
                email: document.getElementById('edit_email').value,
                password: document.getElementById('edit_password').value
            };

            // Роль пользователя
            const role = document.getElementById('edit_role').value;

            // Отправляем PUT-запрос на сервер с ролью в параметрах запроса
            fetch(`/api/users/edit/${userId}?role=${role}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedUser)
            })
                .then(response => {
                    if (response.ok) {
                        // Успешное редактирование пользователя
                        refreshTable();
                        console.log('Пользователь успешно отредактирован.');
                    } else {
                        throw new Error('Ошибка при редактировании пользователя');
                    }
                })
                .catch(error => {
                    console.error('Произошла ошибка при редактировании пользователя:', error);
                });

            // Закрываем модальное окно после редактирования
            $(editModal).modal('hide');
        });
    }

    // Функция для создания и добавления модального окна для удаления пользователя
    function createDeleteModal(userId, userEmail) {
        const deleteModal = document.createElement('div');
        deleteModal.id = `deleteModal${userId}`;
        deleteModal.className = 'modal fade';
        deleteModal.tabIndex = '-1';
        deleteModal.role = 'dialog';
        deleteModal.setAttribute('aria-hidden', 'true');

        deleteModal.innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel2">Delete user</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <h3>Вы действительно, хотите удалить пользователя:</h3>
                        <h2>${userEmail}</h2>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="button-delete">Delete</button>
                    </div>
                </div>
            </div>
        `;

        body.appendChild(deleteModal);
    }

    // Функция для обработки события нажатия на кнопку "Delete"
    function handleDeleteClick(userId, userEmail) {
        // Создаем и добавляем модальное окно для удаления
        createDeleteModal(userId, userEmail);

        // Открываем модальное окно Delete
        const deleteModal = document.getElementById(`deleteModal${userId}`);
        $(deleteModal).modal('show');

        const deleteButton = deleteModal.querySelector('.button-delete');
        // Добавляем обработчик события клика на кнопку "Delete"
        deleteButton.addEventListener('click', function () {
            // Отправляем DELETE-запрос на сервер для удаления пользователя
            fetch(`/api/users/delete/${userId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        // Успешное удаление пользователя
                        refreshTable();
                        console.log('Пользователь успешно удален.');
                    } else {
                        throw new Error('Ошибка при удалении пользователя');
                    }
                })
                .catch(error => {
                    console.error('Произошла ошибка при удалении пользователя:', error);
                });

            // Закрываем модальное окно после удаления
            $(deleteModal).modal('hide');
        });
    }

    // Найти форму, с которой вы хотите отправить данные
    const newUserForm = document.querySelector('.new-user-form');

// Назначить обработчик события на отправку формы
    newUserForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Предотвратить отправку формы по умолчанию

        // Ваш JSON-объект пользователя
        const editedUser = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // Роль пользователя
        const role = document.getElementById('role').value;

        // Отправить POST-запрос на сервер для создания нового пользователя
        fetch(`/api/users/create?role=${role}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedUser)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                document.getElementById('tab-btn-1').checked = true;
                refreshTable();
                return response.json();
            })
            .then(data => {
                // В этом месте вы можете обработать ответ от сервера, если это необходимо

                // После успешного создания пользователя, вы можете обновить таблицу
                refreshTable(); // Предполагается, что у вас уже есть функция refreshTable
            })
            .catch(error => {
                document.getElementById('tab-btn-1').checked = true;
                console.error('Произошла ошибка при создании пользователя:', error);
            });
    });


    // Функция для обновления таблицы
    function refreshTable() {
        const userTableBody = document.getElementById('user-table-body');

        fetch('/api/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                return response.json();
            })
            .then(users => {
                // Очищаем текущие данные в таблице
                userTableBody.innerHTML = '';

                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name).join(', ')}</td>
                    <td>
                        <button type="button" class="button-edit" data-toggle="modal" data-target="#editModal${user.id}">Edit</button>
                    </td>
                    <td>
                        <button type="button" class="button-delete">Delete</button>
                    </td>
                `;

                    // Назначаем обработчик события для кнопки "Delete"
                    const deleteButton = row.querySelector('.button-delete');
                    deleteButton.addEventListener('click', () => handleDeleteClick(user.id, user.email));

                    // Назначаем обработчик события для кнопки "Edit"
                    const editButton = row.querySelector('.button-edit');
                    editButton.addEventListener('click', () => handleEditClick(user));

                    userTableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Произошла ошибка при получении данных:', error);
            });
    }

// Вызываем функцию для обновления таблицы
    refreshTable();


});