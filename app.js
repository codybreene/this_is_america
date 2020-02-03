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

const NodeGeocoder = require("node-geocoder");
const options = {
  provider: "openstreetmap",
  httpAdapter: "https", // Default
  // apiKey: keys.geocoderKey, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

//credit to https://github.com/viswesh/Tweeties/ for the socket.io setup and
//twitter integration

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

http.listen(PORT, () => {
  console.log(`listening on ${PORT}...this the websocket test`)
})

const twit = new Twitter({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  access_token_key: keys.token,
  access_token_secret: keys.tokenSecret
});

// app.get('/bernie_tweets', (req, res) => {
//   twit
//     .get("search/tweets.json", { q: "bernie sanders", count: 10 })
//     .then(result => {
//       const tweets = [];
//       const count = 0
//       const promises = result.statuses.forEach(tweet => {
//         if (tweet.user.location !== "") {
//           geocoder.geocode(tweet.user.location).then(res => {
//             const location = { lat: res[0].latitude, lng: res[0].longitude };
//             const tweetObj = {
//               coords: location,
//               text: tweet.text,
//               truncated: tweet.truncated,
//               user: tweet.user,
//               quoted_status: tweet.quoted_status,
//               is_quote_status: tweet.is_quote_status,
//               extended_tweet: tweet.extended_tweet
//             };
//             tweets.push(tweetObj);
//             if(tweets.length === count) return tweets
//             count+=1
//           });
//         }
//       })
//       Promise.all(promises).then(res => console.log(res))
//     })
// })

io.on("connection", socket => {
  console.log("inside initial socket connection")
  stream(socket);
  socket.on("connection", () => console.log("Client connected"));
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const stream = (socket) => {
  twit.stream(
    "statuses/filter",
    { track: "sanders, biden, warren, buttigieg, bloomberg" },
    stream => {
      setTimeout(() => {
        console.log("removing all listeners...")
        stream.removeAllListeners("data")
      }, 15000)
      console.log("inside twitter stream");
      stream.on("data", tweet => {
        //filter tweet for location data
        if(tweet.user.location != null) {
          geocoder.geocode(tweet.user.location)
            .then(res => {
              const location = { lat: res[0].latitude, lng: res[0].longitude };
              const tweetObj = {
                coords: location,
                text: tweet.text,
                truncated: tweet.truncated,
                user: tweet.user,
                quoted_status: tweet.quoted_status,
                is_quote_status: tweet.is_quote_status,
                extended_tweet: tweet.extended_tweet
              };
              console.log(tweetObj);
              socket.emit("data", tweetObj);
          });
        }
      });
      stream.on("error", error => {
        console.log(error);
      });
    });
}

//geocode helper
// const getLatLng = (place) => {
//   geocoder.geocode(place)
//     .then(res => res)
// }
