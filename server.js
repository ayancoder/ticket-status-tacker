const express = require('express');
const connectDB = require('./config/db')
const userRouter = require('./routes/api/user');
const authRouter = require('./routes/api/auth');
const postsRouter = require('./routes/api/post')
const profileRouter = require('./routes/api/profile')

const app = express();
// connect to database
connectDB();

const PORT = process.env | 5000;

app.use(express.json({extended : false}));
app.get('/', (req, res)=> {
    res.send("welcome");
})

app.use('/api/users',userRouter);
app.use('/api/profiles',profileRouter);
app.use('/api/auth',authRouter);
app.use('/api/posts',postsRouter);

app.listen(PORT, ()=> { console.log(`node started ${PORT}`)})