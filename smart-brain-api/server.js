const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smartbrain'
    }
  });



const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{res.json('Hello')})
app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)})
app.post('/register',(req,res)=>{register.handleRegister(req,res,db,bcrypt)})
app.get('/profile/:id',(req,res)=>{profile.handleProfileGet(req,res,db)})
app.put('/image',(req,res)=>{image.handleImage(req,res,db)})
app.post('/imageurl',(req,res)=>{image.handleImageApiCall(req,res)})

app.listen(3001,()=>{
    console.log('app is running on port 3001');
})

/*
res = this is working 
signin --> post = success/fail
register --> post = user
profile/:userId --> get = user
image --> put --> user



*/