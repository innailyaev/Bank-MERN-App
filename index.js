const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')


const app = express();
const usersRouter = require('./server/routes/users.route');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/users', usersRouter);

app.get('/',(req,res)=>{
    res.json({success : 'Bank API'})
})

//connect to db with mongoose
mongoose.connect('mongodb+srv://innailyaev:CdZkVJeEQeMtFR9j@cluster.o79ew.mongodb.net/bankapi', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("database connect")
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`application start at ${process.env.PORT || 5000}`)
})
