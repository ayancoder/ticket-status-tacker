const express = require('express');
cors = require('cors')
const connectDB = require('./config/db')
const userRouter = require('./routes/api/user');
const authRouter = require('./routes/api/auth');
const ticketRouter = require('./routes/api/ticket');
const profileRouter = require('./routes/api/profile');
const imageRouter = require('./routes/api/image');

const app = express();
// connect to database
connectDB();

const PORT = process.env | 5000;
//app.use('/images', express.static('images'));

app.use(cors())
app.use(express.json({extended : false}));
app.get('/', (req, res)=> {
    res.send("welcome");
})

app.use('/api/users',userRouter);
app.use('/api/profiles',profileRouter);
app.use('/api/auth',authRouter);
app.use('/api/tickets',ticketRouter);
app.use('/api/images', imageRouter);

app.listen(PORT, ()=> { console.log(`node started ${PORT}`)})