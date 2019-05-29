$(document).ready(function() {
  //on load, load correct favorite icon
  $.ajax({
    url: "getFavorite",
    type: "POST",
    data: { collection: "songs" },
    success: function(data) {
      console.log("clicking on tips. need to check if favorited: ", data);
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
    console.log(song_name);
    console.log(artist);
    console.log(section);
    const a = "Sexy and I know it",
      b = "LMFAO";

    const getLyrics = $.ajax({
      type: "GET",
      data: {
        apikey: "c19e78e81750d07fb415f8fda78a663c",
        q_track: a,
        q_artist: b,
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

    database.ref("songs/" + section).once("value", function(snapshot) {
      const songs = snapshot.val();
      const song = _.find(songs, { track_name: song_name });
      console.log(song);
      $(".favorite").attr("id", section + "/track" + song["song_num"]);
    });
  } else {
    $("#lyrics").html("nothing Received");
  }
});
