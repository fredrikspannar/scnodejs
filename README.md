# scnodejs

A Typescript/Node.JS backend-project with persistant storage in MySQL

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

## Migrations
Before running any migration-command you need to create an enviroment configuration

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

## Running

Before running any scenario you need to create an enviroment configuration and also run migrations (up) to create the database tables

### Development

```
npm run dev
```

### Production

```
npm run build
npm start
```

## Tests

Before tests are run the database is refreshed ( all tables dropped and then re-created )

Run tests with

```
npm test
```

## API Documentation

### Create user

```
POST /api/users

Required Fields:
    email : string ( no longer than 255 chars )
    password : string ( no longer than 255 chars, between 8 to 15 characters )
```

Successfully created:

```
Statuscode: 201

Body: { 
        token: XXXXXXXXXXXX,
        user_id: YY
    }

Where XXXXXXXXXXXX is the Authentication token and YY is the user id
```

Failed due to validation errors:

```
Statuscode: 403

Body: { 
        error: "Check required fields"
      }
```

Failed due to user already exist:

```
Statuscode: 409

Body: { 
        error: "Check required fields"
      }
```


## Suggestions for improvements

* Validate email as an actual email
* Stronger password requirements
* Better API Documentation with examples
* More coverage with tests
* A test-enviroment with a test-database