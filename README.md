# Node.JS URL shortener

A Typescript/Node.JS backend-project with persistant storage in MySQL

Tests are run/created with jest

The packages selected were the ones that made the best sense and the architecture/structure was based to create some seperation
so that all logic wouldn't be in one long, long file. Probably could use more structure and seperation depending on the size of
the whole project.

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
POST /api/users/create

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

### Login user

```
POST /api/users/login

Required Fields:
    email : string ( no longer than 255 chars )
    password : string ( no longer than 255 chars, between 8 to 15 characters )
```

Successful login:

```
Statuscode: 200

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

Failed due to login does not exit or error in email and/or password:

```
Statuscode: 403

Body: { 
        error: "Email and/or password is incorrect"
      }
```

### Create link

```
POST /api/links/create

Required Fields:
    userId : number
    link : string ( no longer than 255 chars)

Required headers:
    Authorization : string ( with a valid token from login or create user )
```

Failed due to validation errors:

```
Statuscode: 403

Body: { 
        error: "Check required fields"
      }
```

Successful creation of link:

```
Statuscode: 201
```

### Public link

```
GET /link/[ID]

    Where [ID] is a 8-char string with the shortened link from creation of a link.
    Example: /link/5b568a58
    
    Returns statuscode 302 with the full URL

```

## Suggestions for improvements

* Validate email as an actual valid email
* Stronger password requirements
* Better API Documentation with examples
* More cases and coverage for tests
* A test-enviroment with a test-database
* Validate a link as an actual valid link
* Check if a slug/name is unique and not taken in the database
* Slug/name for a link should use a more readable string instead of a 8-char hex-string
* A global jest before-all for tests which require a user instead of creating a new user for multiple tests