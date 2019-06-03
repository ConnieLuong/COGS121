/**
 * File: story.js
 * Description: Contains the logic for loading in specific song name, artist
 *              and content based on the data passed from the url
 * Author: Hao-In Choi
 */
$(document).ready(function() {
  //on load, load correct favorite icon
  $.ajax({
    url: "getFavorite",
    type: "POST",
    data: { collection: "songs" },
    success: function(data) {
      const song_name = arr[0].split("=")[1];
      const result = _.findWhere(data, { track_name: song_name });

      //if a user is signed in and current tip is in their favorites
      if (result) {
        $(".favorite").html('<i class="fas fa-star fa-fw"></i> Favorited');
      }
    }
  });

  var url = document.location.href,
    queryString = decodeURIComponent(url.split("?")[1]);

  if (queryString) {
    var arr = queryString.split("&");
    const song_name = arr[0].split("=")[1];
    const artist = arr[1].split("=")[1];
    const section = arr[2].split("=")[1];
    console.log("song_name:", song_name);
    console.log("artist", artist);
    console.log("section", section);

    const getLyrics = $.ajax({
      type: "GET",
      data: {
        apikey: "c19e78e81750d07fb415f8fda78a663c",
        q_track: "Da Da Da",
        q_artist: "Trio",
        format: "jsonp",
        callback: "jsonp_callback"
      },
      url: "http://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
      dataType: "jsonp",
      jsonpCallback: "jsonp_callback",
      contentType: "application/json"
    });

    getLyrics
      .done(function(data) {
        console.log(data);
        const lyrics = data.message.body.lyrics.lyrics_body;
        $("#title").html(song_name);
        $("#artist").html(artist);
        $("#lyrics").html(lyrics);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      });

    $.ajax({
      url: "songs",
      type: "GET",
      data: JSON,
      success: function(data) {
        const fav_tracks = data.favorites;
        const hot_tracks = data.hot;
        const new_tracks = data.new;
        const search1 = _.find(fav_tracks, { track_name: song_name });
        const search2 = _.find(hot_tracks, { track_name: song_name });
        const search3 = _.find(new_tracks, { track_name: song_name });

        if (search1 != undefined) {
          console.log(search1);
          $(".favorite").attr("id", "favorite/track" + search1["song_num"]);
        } else if (search2 != undefined) {
          console.log(search2);
          $(".favorite").attr("id", "hot/track" + search2["song_num"]);
        } else {
          console.log(search3);
          $(".favorite").attr("id", "new/track" + search3["song_num"]);
        }
      }
    });
  } else {
    $("#lyrics").html("nothing Received");
  }
});
