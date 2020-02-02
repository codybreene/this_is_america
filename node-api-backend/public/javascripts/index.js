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

document.addEventListener('DOMContentLoaded', () => {

  const map = initMap();
  // draw marker logic
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

  const allMarkers = []

  // add event listeners to politicians
  const sandersPic = document.getElementById("bernie-pic")
  console.log(sandersPic)
  const bloombergPic = document.getElementById("bloomberg-pic")
  const buttigiegPic = document.getElementById("buttigieg-pic")
  const warrenPic = document.getElementById("warren-pic")
  const bidenPic = document.getElementById("biden-pic")

  const delMarkers = (markers) => {
    markers.forEach( marker => {
      marker.setMap(null)
    });
  }

  sandersPic.addEventListener("click", () => {
    console.log("you clicked bernie")
    console.log(`existing markers: ${allMarkers}`)
    delMarkers(allMarkers);
    sandersTweets.tweets.forEach((tweet, index) => {
      setTimeout(() => {
        let marker = new google.maps.Marker({
          position: tweet.coords,
          title: tweet.text
        })
        console.log(`marker: ${marker}`)
        allMarkers.push(marker);
        marker.setMap(map)}, index*200)
    })
  })

  bloombergPic.addEventListener("click", () => {
    console.log(`existing markers: ${allMarkers}`)
    delMarkers(allMarkers);
    bloombergTweets.tweets.forEach(tweet => {
      setInterval(() => {
        let marker = new google.maps.Marker({
          position: tweet.coords,
          title: tweet.text
        });
        marker.setMap(map);
      }, 200);
        allMarkers.push(marker);
    });
  })

  buttigiegPic.addEventListener("click", () => {
    console.log(`existing markers: ${allMarkers}`)
    delMarkers(allMarkers);
    buttigiegTweets.tweets.forEach(tweet => {
      setInterval(() => {
        let marker = new google.maps.Marker({
          position: tweet.coords,
          title: tweet.text
        });
        marker.setMap(map);
      }, 200);
        allMarkers.push(marker);
    });
  })

  warrenPic.addEventListener("click", () => {
    console.log(`existing markers: ${allMarkers}`)
    delMarkers(allMarkers);
    warrenTweets.tweets.forEach(tweet => {
      setInterval(() => {
        let marker = new google.maps.Marker({
          position: tweet.coords,
          title: tweet.text
        });
        marker.setMap(map);
      }, 200);
        allMarkers.push(marker);
    });
  })

  bidenPic.addEventListener("click", () => {
    console.log(`existing markers: ${allMarkers}`);
    delMarkers(allMarkers);
    bidenTweets.tweets.forEach(tweet => {
      setInterval(() => {
        let marker = new google.maps.Marker({
          position: tweet.coords,
          title: tweet.text
        });
        marker.setMap(map);
      }, 200);
        allMarkers.push(marker);
    });
  })

});