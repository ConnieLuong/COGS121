$(document).ready(function() {
  //song-template
  var song_template = Handlebars.compile($("#song-template").html());

  //load all songs onto the page
  database.ref("songs/favorites").once("value", snapshot => {
    const tracks = snapshot.val();
    console.log("received fav data", tracks);
    //for each tip entry in the songs collection, template it and append to favorite section
    Object.keys(tracks).forEach(song => {
      var html = song_template(tracks[song]);
      $("#fav_cards").append(html);
    });
  });

  database.ref("songs/hot").once("value", snapshot => {
    const tracks = snapshot.val();
    console.log("received hot data", tracks);
    //for each tip entry in the songs collection, template it and append to hot section
    Object.keys(tracks).forEach(song => {
      var html = song_template(tracks[song]);
      $("#hot_cards").append(html);
    });
  });

  database.ref("songs/new").once("value", snapshot => {
    const tracks = snapshot.val();
    console.log("received new data", tracks);
    //for each tip entry in the songs collection, template it and append to new section
    Object.keys(tracks).forEach(song => {
      var html = song_template(tracks[song]);
      $("#new_cards").append(html);
    });
  });

  //const ajax call for search children tracks
  const searchTrack = $.ajax({
    type: "GET",
    data: {
      apikey: "c19e78e81750d07fb415f8fda78a663c",
      f_music_genre_id: "1016",
      page: "2",
      page_size: "20",
      format: "jsonp",
      callback: "jsonp_callback"
    },
    url: "http://api.musixmatch.com/ws/1.1/track.search",
    dataType: "jsonp",
    jsonpCallback: "jsonp_callback",
    contentType: "application/json"
  });

  //const ajax call for hot children tracks
  const hotTracks = $.ajax({
    type: "GET",
    data: {
      apikey: "c19e78e81750d07fb415f8fda78a663c",
      f_music_genre_id: "1016",
      page: "1",
      page_size: "20",
      s_track_rating: "desc",
      format: "jsonp",
      callback: "jsonp_callback"
    },
    url: "http://api.musixmatch.com/ws/1.1/track.search",
    dataType: "jsonp",
    jsonpCallback: "jsonp_callback",
    contentType: "application/json"
  });

  //const ajax call for new children tracks
  const newTracks = $.ajax({
    type: "GET",
    data: {
      apikey: "c19e78e81750d07fb415f8fda78a663c",
      f_music_genre_id: "1016",
      page: "1",
      page_size: "20",
      f_track_release_group_first_release_date_min: "20181111",
      format: "jsonp",
      callback: "jsonp_callback"
    },
    url: "http://api.musixmatch.com/ws/1.1/track.search",
    dataType: "jsonp",
    jsonpCallback: "jsonp_callback",
    contentType: "application/json"
  });

  //when all 3 ajax calls are done
  $.when(searchTrack, hotTracks, newTracks)
    .done(function(r1, r2, r3) {
      console.log("received data from music api");
      console.log("fav", r1[0].message.body);
      console.log("hottrack", r2[0]);
      console.log("new", r3[0]);

      fav_track_list = r1[0].message.body.track_list;
      hot_track_list = r2[0].message.body.track_list;
      new_track_list = r3[0].message.body.track_list;

      //storing the received data from the api
      fav_track_list.forEach((e, i) => {
        e.track["song_num"] = i;
        e.track["cover_art"] = "./img/coverart.jpg";
        database.ref("songs/favorites/track" + i).set(e.track);
      });

      hot_track_list.forEach((e, i) => {
        e.track["song_num"] = i;
        e.track["cover_art"] = "./img/coverart.jpg";
        database.ref("songs/hot/track" + i).set(e.track);
      });

      new_track_list.forEach((e, i) => {
        e.track["song_num"] = i;
        e.track["cover_art"] = "./img/coverart.jpg";
        database.ref("songs/new/track" + i).set(e.track);
      });
    })
    // fail message
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    });

  //for debugging purpose
  $("#removeDB").click(() => {
    console.log("removing child");
    database.ref("songs/").remove();
  });

  //regenearate new list.
  //remove the html first, then shuffle the data from firebase. Then take the first five
  //and load to the front end
  $("#reGenBtn").click(() => {
    console.log("regenerating new track list");
    $("#new_cards").empty();
    database.ref("songs/new").once("value", snapshot => {
      const tracks = snapshot.val();
      const newTracks = shuffle(Object.keys(tracks));

      newTracks.slice(0, 5).forEach(song => {
        var html = song_template(tracks[song]);
        $("#new_cards").append(html);
      });
    });
  });
});

//helper function for randomize array;
function shuffle(array) {
  let i = array.length;
  let j = 0;
  let temp;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));

    //swap randomly chosen elemen with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

//knowing which song is clicked
function getTrackDetails(track_name, artist_name) {
  console.log(track_name);
  console.log(artist_name);
  url =
    "./song.html?name=" +
    encodeURIComponent(track_name) +
    "&artist=" +
    encodeURIComponent(artist_name);
  console.log(url);
  document.location.href = url;
}
