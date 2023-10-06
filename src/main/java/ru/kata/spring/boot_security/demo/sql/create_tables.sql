-- Создание таблицы roles
CREATE TABLE IF NOT EXISTS roles
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
    );

-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    age        INT,
    active     TINYINT(1) DEFAULT 0
    );

-- Создание таблицы users_roles для связей пользователей и ролей
CREATE TABLE IF NOT EXISTS users_roles
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    users_id INT NOT NULL,
    role_id  INT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users (id),
    FOREIGN KEY (role_id) REFERENCES roles (id)
    );

-- Вызов хранимой процедуры для создания начальных данных
CALL CreateInitialUsersIfTableEmpty();