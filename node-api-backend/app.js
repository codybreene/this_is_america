const express = require('express');
const httpServer = require('http')
const app = express();
const http = httpServer.createServer(app);
const path = require('path');
const Twitter = require('twitter');
const socketio = require("socket.io");
const io = socketio(http);
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//credit to https://github.com/viswesh/Tweeties/ for the socket.io setup and
//twitter integration

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

http.listen(8000, () => {
  console.log('listening on 8000...this the websocket test')
})

const twit = new Twitter({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  access_token_key: keys.token,
  access_token_secret: keys.tokenSecret
});

io.on("connection", socket => {
  console.log("inside initial socket connection")
  stream(socket);
  socket.on("connection", () => console.log("Client connected"));
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const stream = (socket) => {
  twit.stream(
    "statuses/filter",
    { track: "trump, donald trump, bernie sanders, sanders, elizabeth warren \
      joe biden, biden, warren" },
    stream => {
      console.log("inside twitter stream");
      stream.on("data", tweet => {
        if(tweet.place != null || tweet.user.location != null) //filter tweet for location data
          socket.emit("data", tweet);
      });
      stream.on("error", error => {
        console.log(error);
      });
    }
  );
}

//reverse geocode query
app.get('/tweet_test', (req, res) => {
  twit
    .get(
      "geo/reverse_geocode.json",
      {"lat":"37.781157", "long":"-122.398720"}
    )
    .then(result => res.send(result))
    .catch(err => console.log(err));
})

//get place tweets
app.get('/tweet_place', (req, res) => {
  twit
    .get(
      "geo/reverse_geocode.json",
      {"lat":"37.781157", "long":"-122.398720"}
    )
    .then(result => res.send(result))
    .catch(err => console.log(err));
})

// const url =
//   "https://api.twitter.com/1.1/search/tweets.json?q=&geocode=29.7604,-95.3698,100mi&count=5&locale=en";
// app.get('/tweets',
//   (req, res) => {
//     axios.get(
//       url,
//       {headers: headers}
//     ).then(tweets => res.json(tweets.data.statuses))
//       .catch(err => console.log(err))
//   })



// app.listen(PORT, () => {
//   console.log(__dirname);
//   console.log(`listening on ${PORT}`)
// })
