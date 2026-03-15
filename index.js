require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

const connectDB = require('./config/db');
const passport = require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// ================= DB =================
connectDB();

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// ================= SESSION =================
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

// ================= GLOBAL VIEW DATA =================
app.use((req, res, next) => {
  // Passport user
  res.locals.user = req.user || null;

  // Active link helper
  res.locals.currentPath = req.path;

  next();
});

// ================= FLASH MESSAGE =================
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// ================= VIEW ENGINE =================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ================= ROUTES =================
app.use('/', authRoutes);
app.use('/', productRoutes);

// ================= SERVER =================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});