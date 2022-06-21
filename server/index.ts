import dotenv from 'dotenv';
const app = require('./app'); // for tests to be run without "adress already in use" we need to seperate the app and app.listen

// get .env-file
dotenv.config();

const port = process.env.PORT;

// start sever
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});