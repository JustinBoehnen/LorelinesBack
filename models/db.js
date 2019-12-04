const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, (err) => {
    if(!err)
    {
        console.log('connected to database');
    }
    else{
        console.log('error connectiong to mongo: ' + JSON.stringify(err, undefined, 2));
    }
});

require('./UserAccounts.model');