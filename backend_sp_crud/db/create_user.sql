DELIMITER $$

CREATE PROCEDURE CreateUser(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_created_by INT
)
BEGIN
    INSERT INTO users (name, email, phone, created_by)
    VALUES (p_name, p_email, p_phone, p_created_by);
END$$

DELIMITER ;
