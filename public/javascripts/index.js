import axios from 'axios';
import {initMap, addMarker} from './map';
import io from "socket.io-client";
import {
  buttigieg, 
  bloomberg,
  sanders, 
  biden, 
  warren, 
  } from './filter'

document.addEventListener('DOMContentLoaded', () => {

  const map = initMap();
  // draw marker logic
  // const socket = io("http://localhost:8000/");
  // const socket = io("https://democratic-candidates.herokuapp.com/");
  // add event listeners to politicians

  const sandersPic = document.getElementById("bernie-pic")
  const bloombergPic = document.getElementById("bloomberg-pic")
  const buttigiegPic = document.getElementById("buttigieg-pic")
  const warrenPic = document.getElementById("warren-pic")
  const bidenPic = document.getElementById("biden-pic")

  const candidates = [
    {
      person: bloomberg,
      pic: bloombergPic
    },
    {
      person: buttigieg,
      pic: buttigiegPic
    },
    {
      person: sanders,
      pic: sandersPic
    },
    {
      person: biden,
      pic: bidenPic
    },
    {
      person: warren,
      pic: warrenPic
    }
  ]

  const allMarkers = []

  const requestTweets = (candidate) => axios.get(
      "/politician_tweets", 
      {params: {
        query: candidate.person.query}
      })

  window.bloomberg = bloomberg
  window.buttigieg = buttigieg
  window.sanders = sanders
  window.biden = biden
  window.warren = warren

  // socket.on("connect", () => {
  //   console.log("Socket Connected");
  // });
  
  // socket.on("data", data => {
  //   console.log("inside client socket")
  //   if(allTweets.length < 500) {
  //     allTweets.push(data);
  //     candidates.forEach(candidate => {
  //       console.log("inside candidates loop")
  //       if(filterTweet(data, candidate.terms)) candidate.tweets.push(data)
  //     })
  //   } else {
  //     socket.removeAllListeners("data")
  //   }
  //   console.log(allTweets)
  // });

  // socket.on("disconnect", () => {
  //   socket.removeAllListeners("data");
  //   console.log("Socket Disconnected");
  // });

  //delete markers
  const delMarkers = (markers) => {
    markers.forEach( marker => {
      marker.setMap(null)
    });
  }

  //place markers
  const placeMarkers = (candidate) => {
    candidate.tweets.forEach((tweet, index) => {
      setTimeout(() => {
        let marker = new google.maps.Marker({
          position: tweet.coords,
          title: tweet.text
        })
        allMarkers.push(marker);
        marker.setMap(map)}, (index+1)*200)
    })
  }
  
  candidates.forEach(candidate => {
    candidate.pic.addEventListener("click", () => {
      delMarkers(allMarkers)
      requestTweets(candidate).then(tweets => {
        tweets.data.forEach(tweet => {
          candidate.person.tweets.push(tweet);
        })
      }).then(() => placeMarkers(candidate.person));
    })
  })


  // sandersPic.addEventListener("click", () => {
  //   delMarkers(allMarkers);
  //   placeMarkers(sanders)
  // });

  // bloombergPic.addEventListener("click", () => {
  //   delMarkers(allMarkers);
  //   placeMarkers(bloomberg)
  //   });

  // buttigiegPic.addEventListener("click", () => {
  //   delMarkers(allMarkers);
  //   placeMarkers(buttigieg)
  // });

  // warrenPic.addEventListener("click", () => {
  //   console.log("clicked warren")
  //   delMarkers(allMarkers);
  //   warrenTweets.tweets.forEach((tweet, index) => {
  //     setTimeout(() => {
  //       let marker = new google.maps.Marker({
  //         position: tweet.coords,
  //         title: tweet.text
  //       });
  //       allMarkers.push(marker);
  //       marker.setMap(map);
  //     }, index * 200);
  //   });
  // })

  // bidenPic.addEventListener("click", () => {
  //   console.log("clicked biden")
  //   delMarkers(allMarkers);
  //   bidenTweets.tweets.forEach((tweet, index) => {
  //     setTimeout(() => {
  //       let marker = new google.maps.Marker({
  //         position: tweet.coords,
  //         title: tweet.text
  //       });
  //       console.log(`marker: ${marker}`);
  //       allMarkers.push(marker);
  //       marker.setMap(map);
  //     }, index * 250);
  //   });
  // })

});