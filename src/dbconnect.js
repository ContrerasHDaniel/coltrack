const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sigfox-db-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));