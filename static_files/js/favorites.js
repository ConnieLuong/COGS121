/**
 * File: favorite.js
 * Description: Contains the logic for loading a tip,
 *              story, or song according to the user's data info
 * Author: Connie Luong, Hao-In Choi
 */
$(document).ready(function() {
  //tip-template
  const tt_template = Handlebars.compile($("#tip-template").html());

  //tip-content-template
  const tc_template = Handlebars.compile($("#tip-content-template").html());

  //story-template
  const s_template = Handlebars.compile($("#story-template").html());

  //song-template
  const song_template = Handlebars.compile($("#song-template").html());

  //showing tips by default
  console.log("loading in favorite tips by default");

  $.ajax({
    url: "getFavorite",
    type: "POST",
    data: {
      collection: "tips"
    }
  })
    .done(function(data) {
      console.log(data);
      if (data.message == "You need to sign in to see favorites") {
        $("#overlay").css("display", "block");
      } else {
        Object.keys(data).forEach(e => {
          var html = tt_template(data[e]);
          $(".feed").append(html);
        });
        console.log("done loading tips");
      }
    })
    .fail(function(data) {
      console.log(data.message);
      alert(data.message);
    });

  $(".filter").click(function(e) {
    $(".feed").empty();
    const filter = event.target.id;
    //for each filter button, remove active_filter
    $("button").removeClass("active_filter");
    //add active_filter to clicked button
    event.target.classList.add("active_filter");

    //load favorite tips
    if (filter == "Tips") {
      console.log("attempting to get favorite tips");
      $.ajax({
        url: "getFavorite",
        type: "POST",
        data: {
          collection: "tips"
        }
      })
        .done(function(data) {
          console.log(data);
          Object.keys(data).forEach(e => {
            var html = tt_template(data[e]);
            $(".feed").append(html);
          });
          console.log("done loading tips");
        })
        .fail(function(data) {
          console.log(data.message);
          console.log("fail getting tip");
        });
    }
    //load favorite stories
    else if (filter == "Stories") {
      console.log("attempting to get favorite stories");
      $.ajax({
        url: "getFavorite",
        type: "POST",
        data: {
          collection: "stories"
        },
        success: data => {
          console.log(data);
          Object.keys(data).forEach(e => {
            var html = s_template(data[e]);
            $(".feed").append(html);
          });
        },
        error: data => {
          console.log(data.message);
          console.log("fail getting story");
        }
      });
    }
    //load favorited songs
    else {
      console.log("attempting to get favorite songs");
      $.ajax({
        url: "getFavorite",
        type: "POST",
        data: {
          collection: "songs"
        }
      })
        .done(function(data) {
          console.log(data);
          Object.keys(data).forEach(e => {
            var html = song_template(data[e]);
            $(".feed").append(html);
          });
          console.log("done loading song");
        })
        .fail(function(data) {
          console.log(data.message);
        });
    }
  });

  $(document).on("click", ".card-img-top", function(event) {
    console.log("clicking a tip");
    const tipNum = event.target.id;
    console.log(tipNum);
    //if content not showing, show content. Else remove.
    if (event.target.classList.contains("showing")) {
      event.target.classList.remove("showing");
      $("#" + tipNum + "content").remove();
    }
    //else mark element as showing & show content
    else {
      //mark element as showing
      event.target.classList.add("showing");
      showTipContent(tipNum, tc_template);
      $.ajax({
        url: "getFavorite",
        type: "POST",
        data: { collection: "tips" },
        success: function(data) {
          console.log("Checking if ", tipNum, " is favorited: ", data);
          var userFavTips = Object.keys(data);
          //if a user is signed in and current tip is in their favorites
          if (userFavTips.length > 0 && userFavTips.includes(tipNum)) {
            $(".favorite").html('<i class="fas fa-star fa-fw"></i> Favorited');
          }
        }
      });
    }
  });
});

function getTrackDetails(track_name, artist_name) {
  console.log(track_name);
  console.log(artist_name);

  url =
    "./song.html?name=" +
    encodeURIComponent(track_name) +
    "&artist=" +
    encodeURIComponent(artist_name) +
    "&section=favorites";
  console.log(url);

  document.location.href = url;
}

function getStoryDetails(story_name) {
  console.log(story_name);
  url = "./story.html?name=" + encodeURIComponent(story_name);
  console.log(url);
  document.location.href = url;
}

//function to call when a collapsed tip is clicked
function showTipContent(tipNum, tc_template) {
  $.ajax({
    url: "tips",
    type: "GET",
    data: JSON,
    success: function(data) {
      var tips = data;
      var html = tc_template(tips[tipNum]);
      $("#" + tipNum + "card").append(html);
    }
  });
}
