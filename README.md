# scnodejs

## Installation

To install dependencies, run:

```
npm install
```

## Configure enviroment with dotenv
Create a .env-file for the running enviroment with the following options:

```
PORT=8000
DB_HOST="localhost"
DB_USER=""
DB_PASSWORD=""
DB_NAME=""
DB_PORT=3306
SECRET_TOKEN_KEY="your-secret-here"
```

## Tests

Before tests are run the database is refreshed ( all tables dropped and then created )

## Migrations
[Documentation for package "mysql-migrations"](https://github.com/kawadhiya21/mysql-migrations#readme)

Add a new migration called "create_table_users":

```
npm run migrate add migration create_table_users
```

Run migrations for a new database:

```
npm run migrate up
```

Run migrations refresh:

```
npm run migrate refresh
```