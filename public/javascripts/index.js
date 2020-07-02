import axios from 'axios';
import {TableExport} from 'tableexport';

document.addEventListener('DOMContentLoaded', () => {

  // const map = initMap();
  // draw marker logic
  // const socket = io("http://localhost:8000/");
  // const socket = io("https://democratic-candidates.herokuapp.com/");
  // add event listeners to politicians

  // const allMarkers = []
  let resultTweets;
  let resultUsers;
  let tableExports;

  // var tableToExcel = (function () {
  //   debugger
  //   var uri = 'data:application/vnd.ms-excel;base64,'
  //     , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
  //     , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
  //     , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
  //   return function (table, name, filename) {
  //     if (!table.nodeType) table = document.getElementById(table)
  //     var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

  //     document.getElementById("dlink").href = uri + base64(format(template, ctx));
  //     document.getElementById("dlink").download = filename;
  //     document.getElementById("dlink").click();

  //   }
  // })()

  const updateTable = (content, kind) => {
    if(tableExports) tableExports.remove();
    $("#tweet-table > tbody:last-child").empty();
    if(kind == "tweets") {
      $('#tweet-table > tbody:last-child').append('<tr><th>Date</th><th>Handle</th><th>Tweet</th></tr>');
      content.forEach(tweet => {
        $('#tweet-table > tbody:last-child').append(`<tr><td>${tweet.date}</td><td>${tweet.handle}</td><td>${tweet.tweet}</td></tr>`);
      })
    } else {
      $('#tweet-table > tbody:last-child').append('<tr><th>Name</th><th>Handle</th><th>Bio</th></tr>');
      content.forEach(tweet => {
        $('#tweet-table > tbody:last-child').append(`<tr><td>${tweet.name}</td><td>${tweet.screen_name}</td><td>${tweet.description}</td></tr>`);
      })
    }
    tableExports = TableExport(document.getElementById("tweet-table"))
  }

  const requestTweets = (searchTerm) => axios.get(
    "/get_tweets", 
    {params: {
      query: searchTerm}
    })
      .then((tweets) => {
        console.log(tweets)
        resultTweets = tweets.data.statuses.map(tweet => {
          return {
            date: tweet.created_at,
            handle: tweet.user.screen_name,
            tweet: tweet.text
          }
        })
        updateTable(resultTweets, "tweets");
      })


  const requestUsers = (searchTerm) => axios.get(
    "/get_users",
    {
      params: {
        query: searchTerm
      }
    })
      .then((tweets) => {
        console.log(tweets)
        resultUsers = tweets.data.map(tweet => {
          return {
            name: tweet.name,
            screen_name: tweet.screen_name,
            description: tweet.description
          }
        })
        updateTable(resultUsers, "users");
      })

  //fetch form
  const input = document.getElementById("search-term");
  const searchTweets = document.getElementById("search-tweets");
  const searchUsers = document.getElementById("search-users");

  //search tweets
  searchTweets.addEventListener("click", (e) => {
    e.preventDefault();
    requestTweets(input.value);
      })

  //search users
  searchUsers.addEventListener("click", (e) => {
    e.preventDefault();
    requestUsers(input.value);
      })

  window.requestTweets = requestTweets;
  window.requestUsers = requestUsers;

//   //delete markers
//   const delMarkers = (markers) => {
//     markers.forEach( marker => {
//       marker.setMap(null)
//     });
//   }
      
//   //place markers
//   const placeMarkers = (tweets) => {
//     tweets.forEach((tweet, index) => {
//       setTimeout(() => {
//         let marker = new google.maps.Marker({
//           position: tweet.coords,
//           title: tweet.text
//     })
//     allMarkers.push(marker);
//     marker.setMap(map)}, (index+1)*200)
//   })
// }

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