DELIMITER $$

CREATE PROCEDURE GetUsersWithSearchPagination (
    IN p_search VARCHAR(100),
    IN p_limit INT,
    IN p_offset INT,
    IN p_sort_by VARCHAR(100),
    IN p_sort_order VARCHAR(4)
)
BEGIN
  DECLARE searchTerm VARCHAR(200);
  SET searchTerm = CONCAT('%', p_search, '%');

  SET @sql = CONCAT(
    'SELECT * FROM users ',
    'WHERE is_deleted = 0 ',
    'AND (name LIKE "', searchTerm, '" OR email LIKE "', searchTerm, '") ',
    'ORDER BY ', p_sort_by, ' ', p_sort_order, ' ',
    'LIMIT ', p_limit, ' OFFSET ', p_offset
  );

  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;
