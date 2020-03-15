import axios from 'axios';
import {initMap, addMarker} from './map';

document.addEventListener('DOMContentLoaded', () => {

  const map = initMap();
  // draw marker logic
  // const socket = io("http://localhost:8000/");
  // const socket = io("https://democratic-candidates.herokuapp.com/");
  // add event listeners to politicians

  const allMarkers = []
  const resultTweets = []

  const requestTweets = (searchTerm) => axios.get(
      "/get_tweets", 
      {params: {
        query: searchTerm}
      })

  //fetch form
  const form = document.getElementById("search-form")
  const input = document.getElementById("search-term")

  //on submit
  form.addEventListener("submit", (e) => {
    delMarkers(allMarkers)
    e.preventDefault()
    debugger
    requestTweets(input.value).then(tweets => {
      tweets.data.forEach(tweet => {
        resultTweets.push(tweet);
      })
    }).then(() => placeMarkers(resultTweets));
  })

  //delete markers
  const delMarkers = (markers) => {
    markers.forEach( marker => {
      marker.setMap(null)
    });
  }
      
  //place markers
  const placeMarkers = (tweets) => {
    tweets.forEach((tweet, index) => {
      setTimeout(() => {
        let marker = new google.maps.Marker({
          position: tweet.coords,
          title: tweet.text
    })
    allMarkers.push(marker);
    marker.setMap(map)}, (index+1)*200)
  })
}

    // candidates.forEach(candidate => {
    //   candidate.pic.addEventListener("click", () => {
    //     delMarkers(allMarkers)
    //     requestTweets(candidate).then(tweets => {
    //       tweets.data.forEach(tweet => {
    //         candidate.person.tweets.push(tweet);
    //       })
    //     }).then(() => placeMarkers(candidate.person));
    //   })
    // })
    
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