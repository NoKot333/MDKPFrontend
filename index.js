import express from 'express';
import multer from 'multer';
import mongoose, { model } from 'mongoose';
import cors from 'cors';

import {registerValidation,loginValidation, postCreateValidation} from './validation.js';
import {handleValidationErrors, CheckAuth} from './Utils/index.js';
import {UserController, PostController, CommentController} from './controllers/index.js';


mongoose.set("strictQuery", true);
mongoose
    .connect('mongodb+srv://admin:admin@cluster0.zukeyqg.mongodb.net/blog?retryWrites=true&w=majority')
    .then(()=> console.log('DB ok'))
    .catch((err)=> console.log('DB error',err));

const app = express();

const storage = multer.diskStorage( {
    destination: (_,__,cb)=> {
        cb(null,'uploads'); 
    },
    filename: (_,file,cb)=> {
        cb(null,file.originalname); 
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors,  UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors,  UserController.register);
app.patch('/user/:id', CheckAuth, UserController.updateOne)
app.get('/user/:id',  UserController.getOne)

app.post('/upload',CheckAuth, upload.single('image'),(req,res)=> {
    res.json({
        url: '/uploads/'+req.file.originalname,
    });
});

app.get('/tags', PostController.getLastTags);

app.get('/auth/me', CheckAuth ,UserController.getMe);
app.get('/posts',  PostController.getAll);
app.get('/posts/popular',  PostController.getAllPopular);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', CheckAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', CheckAuth, PostController.removeOne);
app.patch('/posts/:id', CheckAuth, postCreateValidation, handleValidationErrors, PostController.updateOne);
app.get('/posts/user/:id', PostController.getUserPost);
app.get('/posts/tags/:tag', PostController.getPostTags);
app.get('/posts/tags/',  PostController.getAll);

app.post('/comments/:id',CheckAuth,CommentController.create);
app.get('/posts/comments/:id',PostController.getPostComments);
app.delete('/user/:id', CheckAuth, UserController.removeOne);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});