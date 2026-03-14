require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// DB connect
connectDB();

//Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

//Flash message
app.use((req,res,next)=>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
// Auth user to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.use('/', authRoutes);
app.use('/', productRoutes);

// Server connection
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));