$(document).ready(function() {
  var url = document.location.href,
    queryString = decodeURIComponent(url.split("?")[1]);

  if (queryString) {
    var arr = queryString.split("&");
    track_name = arr[0].split("=")[1];
    artist = arr[1].split("=")[1];
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
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      });
  } else {
    $(p).html("nothing Received");
  }
});
