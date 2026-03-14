require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const User = require('./models/User');

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


app.use(async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user).lean();
    res.locals.user = user;
  } else {
    res.locals.user = null;
  }
  next();
});

//Flash message
app.use((req,res,next)=>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
// Auth user to all views
app.use(async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user).lean();
    res.locals.user = user;
  } else {
    res.locals.user = null;
  }

  res.locals.currentPath = req.path;
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