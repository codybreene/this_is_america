import axios from 'axios';
import {initMap, addMarker} from './map';
import io from "socket.io-client";
import {
  buttigiegTweets, 
  bloombergTweets,
  sandersTweets, 
  bidenTweets, 
  warrenTweets, 
  filterTweet} from './filter'
import {testGeocode} from '../javascripts/map'

document.addEventListener('DOMContentLoaded', () => {

  const map = initMap();
  const socket = io("http://localhost:8000/");
  const candidates = [
    bloombergTweets,
    buttigiegTweets, 
    sandersTweets, 
    bidenTweets, 
    warrenTweets
  ]
  const allTweets = []
  window.allTweets = allTweets
  window.bloombergTweets = bloombergTweets
  window.buttigiegTweets = buttigiegTweets
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
        console.log("inside candidates loop")
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

  // add event listeners to politicians
  const sandersPic = document.getElementById("bernie")
  const bloombergPic = document.getElementById("bloomberg")
  const buttigiegPic = document.getElementById("buttigieg")
  const warrenPic = document.getElementById("warren")
  const bidenPic = document.getElementById("biden")

  sandersPic.addEventListener("click", () => {
    addMarker(map);
    testGeocode("Bedford, NY")
  })

  bloombergPic.addEventListener("click", () => {

  })

  buttigiegPic.addEventListener("click", () => {

  })

  warrenPic.addEventListener("click", () => {

  })

  bidenPic.addEventListener("click", () => {

  })
})
