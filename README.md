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
```

## Tests

## Migrations
Add a new migration called "create_table_users":

```
npm run migrate add migration create_table_users
```

Run migrations for a new database:

```
npm run migrate up
```