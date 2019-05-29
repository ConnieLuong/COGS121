$(document).ready(function() {
  $(document).ready(function() {
    $(".carousel1").slick({
      autoplay: true,
      autoplaySpeed: 3000
    });
  });
  //song-template
  var song_template = Handlebars.compile($("#song-template").html());
  var story_template = Handlebars.compile($("#story-template").html());

  //load all songs onto the page
  loadSongs();

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

      let j = 0;
      let counter3 = 0;
      let counter2 = 19;
      //storing the received data from the api
      /* fav_track_list.forEach((e, i) => {
        e.track["song_num"] = i;
        e.track["cover_art"] = "./img/artcover/" + j + ".jpg";
        database.ref("songs/favorites/track" + i).set(e.track);
      }); */

      hot_track_list.forEach((e, i) => {
        e.track["song_num"] = i;
        e.track["cover_art"] = "./img/artcover/" + counter2 + ".jpg";
        database.ref("songs/hot/track" + i).set(e.track);
        counter2--;
      });

      new_track_list.forEach((e, i) => {
        e.track["song_num"] = i;
        e.track["cover_art"] = "./img/artcover/" + counter3 + ".jpg";
        database.ref("songs/new/track" + i).set(e.track);
        counter3++;
      });
    })
    // fail message
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    });

  //regenearate new list.
  //remove the html first, then shuffle the data from firebase. Then take the first five
  //and load to the front end
  $("#reGenBtn").click(() => {
    console.log("regenerating new track list");
    $("#new_cards").empty();

    //will trigger different loading depends on the which tap it is in.
    if ($("#song").hasClass("active_filter")) {
      database.ref("songs/new").once("value", snapshot => {
        const tracks = snapshot.val();
        const newTracks = shuffle(Object.keys(tracks));

        newTracks.slice(0, 5).forEach(song => {
          var html = song_template(tracks[song]);
          $("#new_cards").append(html);
        });
      });
    } else {
      database.ref("stories/").once("value", snapshot => {
        const stories = snapshot.val();
        const newStories = shuffle(stories);
        for (i = 10; i < 15; i++) {
          var html = story_template(stories[i]);
          $("#new_cards").append(html);
        }
      });
    }
  });

  //Filters
  $("#story").click(function(event) {
    $("#fav_cards").empty();
    $("#hot_cards").empty();
    $("#new_cards").empty();
    $("#hlImg1").attr("src", "");
    $("#hlImg2").attr("src", "");
    $("#hlImg3").attr("src", "");
    const filter = event.target.id;
    //for each filter button, remove active_filter
    $("button").removeClass("active_filter");
    //add active_filter to clicked button
    event.target.classList.add("active_filter");

    //loading fav_stories - will connect with fav later
    database.ref("stories/").once("value", function(snapshot) {
      const stories = snapshot.val();
      $("#hlImg1").attr("src", stories[03].story_img);
      $("#hlImg2").attr("src", stories[01].story_img);
      $("#hlImg3").attr("src", stories[10].story_img);
      for (i = 0; i < 5; i++) {
        var html = story_template(stories[i]);
        $("#fav_cards").append(html);
      }
    });

    //loading hot_stories
    database.ref("stories/").once("value", function(snapshot) {
      const stories = snapshot.val();
      for (i = 5; i < 10; i++) {
        var html = story_template(stories[i]);
        $("#hot_cards").append(html);
      }
    });

    //loading new_stories
    database.ref("stories/").once("value", function(snapshot) {
      const stories = snapshot.val();
      for (i = 10; i < 15; i++) {
        var html = story_template(stories[i]);
        $("#new_cards").append(html);
      }
    });
  });

  $("#song").click(function(event) {
    $("#fav_cards").empty();
    $("#hot_cards").empty();
    $("#new_cards").empty();
    $("#hlImg1").attr("src", "");
    $("#hlImg2").attr("src", "");
    $("#hlImg3").attr("src", "");
    const filter = event.target.id;
    //for each filter button, remove active_filter
    $("button").removeClass("active_filter");
    //add active_filter to clicked button
    event.target.classList.add("active_filter");
    loadSongs();
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
function getTrackDetails(track_name, artist_name, section) {
  console.log(track_name);
  console.log(artist_name);
  console.log(section);
  url =
    "./song.html?name=" +
    encodeURIComponent(track_name) +
    "&artist=" +
    encodeURIComponent(artist_name) +
    "&section=" +
    encodeURIComponent(section);
  console.log(url);

  document.location.href = url;
}

function getStoryDetails(story_name) {
  console.log(story_name);
  url = "./story.html?name=" + encodeURIComponent(story_name);
  console.log(url);
  document.location.href = url;
}

function loadSongs() {
  var song_template = Handlebars.compile($("#song-template").html());
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

    $("#hlImg1").attr("src", tracks["track0"].cover_art);
    $("#hlImg2").attr("src", tracks["track5"].cover_art);
    $("#hlImg3").attr("src", tracks["track3"].cover_art);
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
}
