const express = require('express');
cors = require('cors')
const morgan = require('morgan');
const connectDB = require('./config/db')
const userRouter = require('./routes/api/user');
const authRouter = require('./routes/api/auth');
const ticketRouter = require('./routes/api/ticket');
const profileRouter = require('./routes/api/profile');
const imageRouter = require('./routes/api/image');
const officeRouter = require('./routes/api/office');
const reportRouter = require('./routes/api/reports')
const { PORT, NODE_ENV, MONGO_URI } =  require('./config/config');
const logger = require('./config/winston');

logger.info(`env ${NODE_ENV}`)
logger.info(`db connection string ${MONGO_URI}`)
const app = express();
// connect to database
connectDB();

app.use(morgan('combined', { stream: logger.stream }));
app.use('/uploads', express.static('uploads'));
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
app.use('/api/offices', officeRouter);
app.use('/api/reports/',reportRouter);

app.listen(PORT, ()=> { logger.info(`node started ${PORT}`)})