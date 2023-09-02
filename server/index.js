const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.route');

require('dotenv').config();


const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());


app.use('/api/users',userRoute);


app.listen(port, (req, res)=>{
    console.log(`Running on port ${port}`);
});

mongoose.connect(mongoURI, {
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(response=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    console.log("MongoDb connection failed.", err);
});