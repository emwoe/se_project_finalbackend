const express = require('express');
const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/studyhelper')

app.listen(PORT, () => {
    // if everything works fine, the console will show which port the application is listening to
    console.log(`App listening at port ${PORT}`);
  })