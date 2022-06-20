module.exports = {
    "up": "CREATE TABLE users (user_id INT(11) NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL , password VARCHAR(255) NOT NULL , created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, deleted_at DATETIME NULL , PRIMARY KEY(user_id))",
    "down": "DROP TABLE users"
}