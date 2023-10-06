document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('table-body');

    fetch('/api/users/me') // Замените URL на адрес вашего API
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roles.map(role => role.name).join(', ')}</td>
            `;
            tableBody.appendChild(row);
        })
        .catch(error => {
            console.error('Произошла ошибка при получении данных:', error);
        });
});