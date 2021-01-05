const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION! Shutting down!');
  console.log(err.name, err.message);
  console.log(err.stack);

  process.exit(1);
});

//the body of the err has changed so this is a workaround to get only the important part from the err.message
const getShortErrMessage = (err) => {
  const fullMessage = err.message;
  const errmsgStart = fullMessage.indexOf('errmsg:') + 8; // Find errmsg inside message
  const errmsgStop = fullMessage.indexOf('at ', errmsgStart); // Find first comma after that
  const errmsgLen = errmsgStop - errmsgStart;
  const errorText = ': failed ' + fullMessage.substr(errmsgStart, errmsgLen);
  return errorText;
};

const app = require('./app');
//const port = process.env.PORT || 3000;

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//The obj {} and attr declared to resolve deprecation warnings
mongoose
  //.connect(process.env.DATABASE_LOCAL,){    --For using the local instance
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true,
  })
  .then(() => {
    console.log('DB connection successfull');
  });

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  const errMessage = getShortErrMessage(err);

  console.log('UNHANDLED REJECTION! Shutting down!');
  console.log(err.name, errMessage);

  server.close(() => {
    process.exit(1);
  });
});
