$(document).ready(function() {
    //on load, load correct favorite icon
    $.ajax({
        url: 'getFavorite',
        type: 'POST',
        data: {collection: "tips"},
        success: function(data) {
            console.log("clicking on tips. need to check if favorited: ", data);
            var userFavTips = Object.keys(data);
            //if a user is signed in and current tip is in their favorites
            if(userFavTips.length>0 && userFavTips.includes(tipNum)){
                $('.favorite').html('<i class="fas fa-star fa-fw"></i> Favorited');
            }
        },
    });


  var url = document.location.href,
    queryString = decodeURIComponent(url.split("?")[1]);

  if (queryString) {
    var arr = queryString.split("&");
    const track_name = arr[0].split("=")[1];
    const artist = arr[1].split("=")[1];
    console.log(track_name);
    console.log(artist);
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
        $("#title").html(track_name);
        $("#artist").html(artist);
        $("#lyrics").html(lyrics);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      });
  } else {
    $("#lyrics").html("nothing Received");
  }
});
