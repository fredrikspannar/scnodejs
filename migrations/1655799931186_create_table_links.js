module.exports = {
    "up": "CREATE TABLE links (id INT(11) NOT NULL AUTO_INCREMENT, user_id INT(11) NOT NULL, link VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL,created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id))",
    "down": "DROP TABLE links"
}