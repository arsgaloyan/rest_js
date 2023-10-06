DELIMITER
//
CREATE PROCEDURE CreateInitialUsersIfTableEmpty()
BEGIN
    DECLARE
        userCount INT;
    DECLARE
        adminCount INT;
    DECLARE
        userRole INT;
    DECLARE
        adminRole INT;
    DECLARE
        userId INT;
    DECLARE
        adminId INT;

    -- Подсчет количества записей в таблице users для каждой роли
    SELECT COUNT(*)
    INTO userCount
    FROM users
    WHERE email = 'user@mail.ru';
    SELECT COUNT(*)
    INTO adminCount
    FROM users
    WHERE email = 'admin@mail.ru';

-- Если обе роли отсутствуют в таблице, создаем пользователей и роли
    IF
        userCount = 0 AND adminCount = 0 THEN

        SELECT id
        INTO userRole
        FROM roles
        WHERE name = 'ROLE_USER';
        IF
            userRole IS NULL THEN
            INSERT INTO roles (name) VALUES ('ROLE_USER');
            SET
                userRole = LAST_INSERT_ID();
        END IF;

        SELECT id
        INTO adminRole
        FROM roles
        WHERE name = 'ROLE_ADMIN';
        IF
            adminRole IS NULL THEN
            INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
            SET
                adminRole = LAST_INSERT_ID();
        END IF;

        -- Создание пользователей
        INSERT INTO users (email, password, first_name, last_name, age, active)
        VALUES ('user@mail.ru', '$2a$12$c1Fuo8QZPs0DWtfn1oF77eeBZlV5sVmLQFiOblecho.vYVLUfQdBy', 'User', 'Userov', '30',
                1);
        SET
            userId = LAST_INSERT_ID();

        INSERT INTO users (email, password, first_name, last_name, age, active)
        VALUES ('admin@mail.ru', '$2a$12$E1RD940wjV4m5eXT9aGne.GJMNFFB9VdihZJD4UqMo/6k.uN52baO', 'Admin', 'Adminov',
                '35', 1);
        SET
            adminId = LAST_INSERT_ID();

        -- Привязка ролей к пользователям
        INSERT INTO users_roles (users_id, role_id)
        VALUES (userId, userRole);
        INSERT INTO users_roles (users_id, role_id)
        VALUES (adminId, userRole);
        INSERT INTO users_roles (users_id, role_id)
        VALUES (adminId, adminRole);
    END IF;
END
//
DELIMITER ;