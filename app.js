const express = require('express');
const morgan = require('morgan')
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');


const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');
const userRouter = require('./routes/users');
const appointmentRouter = require('./routes/appointment');
const ticketRouter = require('./routes/tickets');
const quizRouter = require('./routes/quizzes');
const quizQuestionsRouter = require('./routes/quizQuestions');
const quizresultsRouter = require('./routes/quizResults');
const testResultsRouter = require('./routes/testResults');
const orderRouter = require('./routes/orders');
const broadcastMessages = require('./routes/broadcastMessages');
const supportMessages = require('./routes/supportMessages');
const { Message, Chat } = require('./models/messages');
const { User } = require('./models/users');
const checkAuth = require('./middleware/chcek-auth');
const multer = require('multer');
var moment = require('jalali-moment');
var moment = require('moment-jalaali')
const d = new Date()
console.log(new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d));



const app = express();
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "localhost",
        methods: ["GET", "POST"],
    }
});




require('dotenv/config');
process.env.TZ = "Asia/Tehran";
const api = process.env.API_URL;


app.use(cors());


//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// app.use()

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/appointments`, appointmentRouter);
app.use(`${api}/tickets`, ticketRouter);
app.use(`${api}/quizzes`, quizRouter);
app.use(`${api}/quiz/questions`, quizQuestionsRouter);
app.use(`${api}/quiz/results`, quizresultsRouter);
app.use(`${api}/test-results`, testResultsRouter);
app.use(`${api}/broadcast-messages`, broadcastMessages);
app.use(`${api}/support-messages`, supportMessages);
app.use(`${api}/orders`, orderRouter);


console.log(process.env.CONNECTION_STRING)
//Database Connection
mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connection is ready...')
    })
    .catch(err => {
        console.log('Database error', err)
    });
mongoose.set('useCreateIndex', true);


// Socket.io

io.on('connection', socket => {
    // console.log('Socket connected');
    socket.on('storeClientInfo', data => {
        console.log(data.customId);
        socket.username = data.customId;
        User.findOneAndUpdate({ _id: data.customId }, { connection: 'online' }).exec()
    });
    socket.on("disconnect", () => {
        // io.emit('message', 'a user has left the chat');
        console.log("disconnect");
        console.log(socket.username);
        User.findOneAndUpdate({ _id: socket.username }, { connection: Date.now() }).exec()
    });
    socket.on('chatMessage', async msg => {
        console.log(msg.chat)
        if (msg.chat === "new") {
            const chat = new Chat({ users: ['63b81a7db6592724c84ea0dd', '63b9bc71e65b428bcce25c2e'] });
            chat.save().then(result => {
                const message = new Message({
                    message: msg.message,
                    user: msg.user,
                    chat: result['_id'],
                    sender: msg.sender,
                    type: msg.type,
                    filePath: msg.filePath,
                    date: msg.date
                });
                message.save().then(res => {
                    console.log(res)
                    io.emit('message', res['_id'])
                }).catch(err => {
                    console.log(err)
                });
            }).catch(err => {
                console.log(err);
            });
        } else {
            console.log('old')
            const message = new Message({
                message: msg.message,
                user: msg.user,
                chat: msg.chat,
                sender: msg.sender,
                type: msg.type,
                filePath: msg.filePath,
                date: msg.date
            });
            message.save().then(res => {
                console.log(res)
                io.emit('message', res['_id'])
            }).catch(err => {
                console.log(err)
            });
        }


    });
    socket.on('deleteChat', msg => {
        console.log(msg);
        Message.findByIdAndDelete(msg).then(message => {
            if (message) {
                console.log('message deleted')
                io.emit('deleted', true)
            } else {
                io.emit('deleted', false)
            }
        }).catch(err => {
            io.emit('deleted', false)
        })
    });
    socket.on('forwardMessage', msg => {
        Message.findById(msg.id).lean().exec().then(result => {
            console.log(result);
        });
        const message = new Message({
            message: msg.message,
            user: msg.user,
            sender: msg.sender,
            type: msg.type,
            filePath: msg.filePath,
            date: msg.date
        });
        message.save().then(res => {
            console.log(res)
            io.emit('message', res['_id'])
        }).catch(err => {
            console.log(err)
        });
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/messages');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100
    },
    fileFilter: fileFilter
});

const audioStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/messages');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname + '.mp3');
    }
});

const audioFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const audioUpload = multer({
    storage: audioStorage,
    limits: {
        fileSize: 1024 * 1024 * 100
    },
    fileFilter: audioFilter
});

app.post(`${api}/messages/file`, upload.single('file'), /*checkAuth,*/(req, res) => {
    console.log(req.file)
    res.status(201).json({ "path": req.file.path });
});

app.post(`${api}/messages/audio`, audioUpload.single('file'), /*checkAuth,*/(req, res) => {
    console.log(req.file)
    res.status(201).json({ "path": req.file.path });
});

app.use(`${api}/chats/`, checkAuth, (req, res) => {
    // const sender = req.userData.userId;
    Chat.find({ 'users': req.userData.userId })
        .lean()
        .populate({ path: 'messages', options: { sort: { 'date': -1 }, limit: 1 } })
        .populate('users')
        .exec()
        .then(result => {
            if (result.length >= 1) {
                // result.forEach((element, index) => {
                //     const d = new Date(element['date']);
                //     element['date'] = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d)
                // });
                var sortedArray = result.sort(function (a, b) {
                    return b.messages[0].date - a.messages[0].sortedArray
                });
                res.status(200).json({ success: true, data: sortedArray });
            } else {
                res.status(204);
            }
        })
    // .catch(err => {
    //     res.status(500).json({ success: false, message: "Error getting the messages", error: err });
    // });
});

app.use(`${api}/messages/:id`, checkAuth, (req, res) => {
    console.log(req.params.id)
    Message.find({ 'chat': req.params.id }).exec()
        .then(result => {
            if (result.length >= 1) {
                result.forEach((element, index) => {
                    const d = new Date(element['date']);
                    element['date'] = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d)
                    console.log(element['date']);
                });
                res.status(200).json({ success: true, data: result[0] });
            } else {
                res.status(404).json({ success: false, message: "No content" });
            }
        })
        .catch(err => {
            res.status(404).json({ success: false, message: "Error getting the messages" });
        });
});

app.use(`${api}/last-message/:id`, checkAuth, (req, res) => {
    console.log(req.params.id)
    Message.find({ 'chat': req.params.id }).sort({ 'date': -1 }).exec()
        .then(result => {
            if (result.length >= 1) {
                result.forEach((element, index) => {
                    const d = new Date(element['date']);
                    element['date'] = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(d)
                    console.log(element['date']);
                });
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(404).json({ success: false, message: "No content" });
            }
        })
        .catch(err => {
            res.status(404).json({ success: false, message: "Error getting the messages" });
        });
});

//Server    
server.listen(4000, () => {
    console.log('Server running localhost:4000')
})

process.on('warning', (warning) => {
    console.log(warning.stack);
});
app.get('/', (req, res) => {
    return res.status(404).send('');
});
// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         error: {
//             error: error.message,
//             message: "Significant Error",
//         },
//     });
// });
