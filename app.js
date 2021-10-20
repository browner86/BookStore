const path = require('path');
const PORT = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const mongoDB_URI = "mongodb+srv://iclient:i2Qgvwy0yORP1p53@cluster0.n4xhi.mongodb.net/shop"
const store = new MongoDBStore({
  uri: mongoDB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf();


const cors = require('cors');

const corsOptions = {
  origin: "https://calm-river-03773.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://iclient:i2Qgvwy0yORP1p53@cluster0.n4xhi.mongodb.net/shop?retryWrites=true&w=majority";


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
let userName = '';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      console.log(user);
      req.user = user;
     console.log(req.user.name);
     username = req.user.name;
    //  return username
      next();
    })
    .catch(err => console.log(err));
});


// comment

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URL, options)
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
