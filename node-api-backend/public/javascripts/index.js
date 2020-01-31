import axios from 'axios';
import {initMap} from './map';
import io from "socket.io-client";
import {trumpTweets, sandersTweets, bidenTweets, warrenTweets, filterTweet} from './filter'

document.addEventListener('DOMContentLoaded', () => {

  const map = initMap();
  const socket = io("http://localhost:8000/");
  const candidates = [trumpTweets, sandersTweets, bidenTweets, warrenTweets]
  const allTweets = []
  window.allTweets = allTweets
  window.trumpTweets = trumpTweets
  window.sandersTweets = sandersTweets
  window.bidenTweets = bidenTweets
  window.warrenTweets = warrenTweets

  socket.on("connect", () => {
    console.log("Socket Connected");
  });
  
  socket.on("data", data => {
    console.log("inside client socket")
    if(allTweets.length < 500) {
      allTweets.push(data);
      candidates.forEach(candidate => {
        if(filterTweet(data, candidate.terms)) candidate.tweets.push(data)
      })
    } else {
      socket.removeAllListeners("data")
    }
    console.log(allTweets)
  });

  socket.on("disconnect", () => {
    socket.removeAllListeners("data");
    console.log("Socket Disconnected");
  });
})
