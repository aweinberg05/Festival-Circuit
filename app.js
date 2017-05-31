const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const methodOverride = require('method-override');
const axios = require('axios');

/* BCrypt stuff here */
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/html');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

app.use(session({
  secret: 'SHOEBILLZ',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.listen(3000, function(){
  console.log("server says hello")
})

var db = pgp("postgres://aliweinberg@localhost:5432/festivals_db");



//*******Log-in/Join Page*****
app.post('/login', function(req, res){
  let data = req.body;
  let auth_error = "Authorization Failed: Invalid email/password";

  db
    .one("SELECT * FROM users WHERE email = $1", [data.email])
    .catch(function(){
      res.send(auth_error);
    })
    .then(function(user){
      bcrypt.compare(data.password, user.password_digest, function(err, cmp){
        if(cmp){
          req.session.user = user;
          // req.session.user_id =user_id
          ///in
          res.redirect("/");
        } else {
          res.send(auth_error);
        }
      });
    });
});

//*******Current session -- Home page*****
app.get('/', function(req, res){
  if(req.session.user){
        let data = {
          logged_in: true,
           user_name: req.session.user.user_name,
           id: req.session.user.id,
           email: req.session.user.email
          //  id: req.session.user.user_id
           //above "id" may not work...
      };
      res.render("home/index", data);

  } else {
    res.render('home/index');
  }
});



//************log-out************
app.get('/logout', function(req, res){
  req.session.user = false;
  res.redirect("/");
});


//******update email*******//
app.put('/user', function(req, res){
  var info
  if(req.session.user){
    let info = {
      logged_in: true,
       user_name: req.session.user.user_name,
       id: req.session.user.id,
       email: req.session.user.email
     };
  var user_id = req.session.user.id
  var id = req.params.id;
  db
    .none("UPDATE users SET email = $1, user_name=$2, profile_pic=$3 WHERE id = $4",
      [req.body.email, req.body.user_name, req.body.profile_pic, req.session.user.id]
    ).catch(function(){
      res.send('Failed to update user.');
    }).then(function(user){
      let data = {
        logged_in: true,
         user_name: req.session.user.user_name,
         id: req.session.user.id,
         email: req.session.user.email

    };
        res.render('users/goto', data)
    });
  }else{
    res.render('home/index');
  }
});

//*******DELETE USER*********
app.delete ('/user', function(req, res){
 console.log(req.session.user.id)
 db.none("DELETE FROM users WHERE id = $1", req.session.user.id)
 .then(function(){
   res.send('BYE FELICIA!!!!')
 })

 });


//***********API Call*********
app.get("/festivals/search", function(req, res){
  const usersdata = req.session.user;

       axios.get("http://api.eventful.com/json/events/search?app_key=F7jWpmt2FtpRWBCX&keywords=edm&date=Future")
       .then(function(response){
          response = response.data.events.event
          // console.log(apiData);
        //  console.log(response)
        //  console.log(data)
         let festival_array = {

          api: response
         };
         res.render("festivals/search", festival_array)
       })
       .catch(err =>{
         console.log("api: "+err)
       })

})

//**************All Festivals*******

app.get("/festivals", function(req, res){
   db
     .any("SELECT * FROM festivals ORDER BY name")
     .then(function(data){
       let festivals_array = {
          festivals: data,

     };
     res.render("festivals/index", festivals_array)
  })
})

//***********ONE FESTIVAL + Comments from attendin************
app.get('/festivals/:id', function(req, res){
  // console.log('This is our user: ' + req.session.user.email);
  const usersdata = req.session.user;
  var id = req.params.id;
  let one_festival;
  db.any("SELECT * FROM attending INNER JOIN festivals ON attending.festival_id = festivals.id INNER JOIN users ON attending.user_id = users.id WHERE festival_id=" + id)
  .then(function(data){
    console.log(data)
    one_festival= {
      festival_id: Number(data[0].festival_id),
      name: data[0].name,
      date: data[0].date,
      festival_image: data[0].festival_image,
      city_or_state: data[0].city_or_state,
      country: data[0].country,
      description: data[0].description,
      data: data,
    }
    res.render('festivals/one', one_festival)
  })
})



//***************post comment***********
app.post('/festivals/:id', function(req, res){
  // id=req.params.id;
  comment = req.body.comment;
  user_id = req.session.user.id;
  attending = req.body.attending;
  festival_id = req.params.id
  console.log("this is post")
  console.log(comment);
  console.log(user_id);
  console.log(attending);
  console.log(festival_id);

  db.one('insert into attending (comment, rsvp, user_id, festival_id) values($1, $2, $3, $4) returning comment', [comment, attending, user_id, festival_id])
  .then (data=>{

  res.redirect('/festivals/' +req.params.id);
})
})

app.post('/festivals', function(req, res){
  // id=req.params.id;
  name = req.body.name;
  date = req.body.date;
  country = req.body.country;
  city_or_state = req.body.city_or_state;
  festival_image = req.body.festival_image;
  description = req.body.desription;
  comment = req.body.comment;
  user_id = req.session.user.id;
  attending = req.body.attending;
  console.log(name);
  console.log(date);
  console.log("this is post")
  console.log(comment);
  console.log(user_id);
  console.log(attending);
  db.one('insert into festivals (name, date, country, city_or_state, festival_image, description) values($1, $2, $3, $4, $5, $6) returning id', [name, date, country, city_or_state, festival_image, description])
  .then (data=>{
  // db.one('insert into attending (comment, rsvp, user_id, festival_id) values($1, $2, $3, $4) returning id', [comment, attending, user_id, festival_id])
  // .then (data=>{
  res.redirect('/festivals');
})
})



//********LIST OF USERS*********
app.get("/users", function(req, res){
   db
     .any("SELECT * FROM users")
     .then(function(data){
       let user_array = {
          users: data,
     };
     res.render("users/index", user_array)
  })
})


//************User Profile****************
app.get('/users/:id', function(req, res){
  var info
  if(req.session.user){
    let info = {
      logged_in: true,
       user_name: req.session.user.user_name,
       email: req.session.user.email
     };
  var user_id = req.session.user.id
  var id = req.params.id;
  db.one("SELECT * FROM users WHERE id=" + id).then(function(data){
    console.log(data)
    var one_user = {
      profile_pic: data.profile_pic,
      user_name: data.user_name,
      password_digest: data.password_digest,
      country: data.country,
      city_or_state: data.city_or_state,
      fave_genre: data.fave_genre,
      fave_festival: data.fave_festival,
      festival_pictures: data.festival_pictures
      };
    res.render('users/show', one_user)
     })
  } else {
    res.render('home/index');
  }
})


//*******Sign-up Page*****
app.get('/signup', function(req, res){
  res.render('users/signup');
});


//********PROFILE SET UP PAGE*********
app.post('/users', function(req, res){
  email = req.body.email
  password_digest = req.body.password_digest
  user_name = req.body.user_name
  country = req.body.country
  city_or_state = req.body.city_or_state
  profile_pic = req.body.profile_pic
  fave_genre = req.body.fave_genre
  fave_festival = req.body.fave_festival
  festival_pictures = req.body.festival_pictures
  bcrypt
  .hash(req.body.password, 10, function(err, hash){
  db.one('insert into users(email, password_digest, user_name, country, city_or_state, profile_pic, fave_genre, fave_festival, festival_pictures) values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id',
  [email, hash, user_name, country, city_or_state, profile_pic, fave_genre, fave_festival, festival_pictures])
  .catch(function(e){
  res.send('Failed to create user: ' + e);
})
  .then (data=>{
    console.log(data.id);
  res.redirect('/')
});
});
});
