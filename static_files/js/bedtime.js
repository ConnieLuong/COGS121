/**
 * File: bedtime.js
 * Description: Contains the logic to load the songs and stories onto the page,
 *              regenerating new song/story list, and sending info to song.html and story.html
 * Author: Hao-In Choi
 */

$(document).ready(function() {
  // using the carousel library - "slick"
  $(".carousel1").slick({
    autoplay: true,
    autoplaySpeed: 3000
  });
  //song-template
  var song_template = Handlebars.compile($("#song-template").html());
  //story-template
  var story_template = Handlebars.compile($("#story-template").html());

  //load all songs onto the page
  loadSongs(song_template);

  //For loading songs from API and store them into firebase
  //Comment out when it is not used.
  //getSongsFromAPI();

  //regenearate new list.
  $("#reGenBtn").click(() => {
    console.log("regenerating new track list");
    $("#new_cards").empty();

    //will trigger different loading depends on the which tap it is in.
    if ($("#song").hasClass("active_filter")) {
      $.ajax({
        url: "songs",
        type: "GET",
        data: JSON,
        success: function(data) {
          const new_tracks = data.new;
          const rnd_new_tracks = shuffle(Object.keys(new_tracks));

          rnd_new_tracks.slice(0, 5).forEach(song => {
            var html = song_template(new_tracks[song]);
            $(html)
              .hide()
              .appendTo("#new_cards")
              .fadeIn(1000);
          });
        }
      });
    } else {
      $.ajax({
        url: "stories",
        type: "GET",
        data: JSON,
        success: function(data) {
          const new_stories = shuffle(data);
          for (i = 10; i < 15; i++) {
            var html = story_template(new_stories[i]);
            $(html)
              .hide()
              .appendTo("#new_cards")
              .fadeIn(1000);
          }
        }
      });
    }
  });

  //Filters
  $(".filter").click(function(e) {
    //empty every div
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

    //load content depending on the active filter
    if (filter == "story") {
      console.log("switching to story tab");
      loadStories(story_template);
    } else {
      console.log("switching to song tab");
      loadSongs(song_template);
    }
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

//passing the name, artist and section  of the song to url so the song.html can parse info from url
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

//passing the name of the story to url so the story.html can parse info from url
function getStoryDetails(story_name) {
  console.log(story_name);
  url = "./story.html?name=" + encodeURIComponent(story_name);
  console.log(url);
  document.location.href = url;
}

//function to load all the songs into the page when the page is initialized
function loadSongs(song_template) {
  $.ajax({
    url: "songs",
    type: "GET",
    data: JSON,
    success: function(data) {
      const fav_tracks = data.favorites;
      const hot_tracks = data.hot;
      const new_tracks = data.new;

      //for each entry in the editor favorite songs collection, template it and append to favorite section
      Object.keys(fav_tracks).forEach(song => {
        var html = song_template(fav_tracks[song]);
        $("#fav_cards").append(html);
      });

      //loading images to the carousel
      $("#hlImg1").attr("src", hot_tracks["track0"].cover_art);
      $("#hlImg2").attr("src", fav_tracks["track5"].cover_art);
      $("#hlImg3").attr("src", new_tracks["track3"].cover_art);
      //for each tip entry in the hot songs collection, template it and append to hot section
      Object.keys(hot_tracks).forEach(song => {
        var html = song_template(hot_tracks[song]);
        $("#hot_cards").append(html);
      });

      //for each tip entry in the hot songs collection, template it and append to new section
      Object.keys(new_tracks).forEach(song => {
        var html = song_template(new_tracks[song]);
        $("#new_cards").append(html);
      });
    }
  });
}

function getSongsFromAPI() {
  //const ajax call for children tracks from Musixmatch API
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

  //const ajax call for hot children tracks from Musixmatch API
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

  //const ajax call for new children tracks from Musixmatch API
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

  //when all 3 ajax calls are done, store songs
  $.when(searchTrack, hotTracks, newTracks)
    .done(function(r1, r2, r3) {
      console.log("received data from music api");
      console.log("fav", r1[0].message.body);
      console.log("hottrack", r2[0]);
      console.log("new", r3[0]);

      fav_track_list = r1[0].message.body.track_list;
      hot_track_list = r2[0].message.body.track_list;
      new_track_list = r3[0].message.body.track_list;

      let counter1 = 0;
      let counter3 = 0;
      let counter2 = 19;
      //storing the received data from the api
      fav_track_list.forEach((e, i) => {
        e.track["song_num"] = i;
        e.track["cover_art"] = "./img/artcover/" + counter1 + ".jpg";
        database.ref("songs/favorites/track" + i).set(e.track);
      });

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
}

function loadStories(story_template) {
  $.ajax({
    url: "stories",
    type: "GET",
    data: JSON,
    success: function(data) {
      //loading images to the carousel
      $("#hlImg1").attr("src", data[03].story_img);
      $("#hlImg2").attr("src", data[01].story_img);
      $("#hlImg3").attr("src", data[10].story_img);
      for (i = 0; i < 10; i++) {
        var html = story_template(data[i]);
        $("#fav_cards").append(html);
      }

      for (i = 10; i < 20; i++) {
        var html = story_template(data[i]);
        $("#hot_cards").append(html);
      }

      for (i = 20; i < 30; i++) {
        var html = story_template(data[i]);
        $("#new_cards").append(html);
      }
    }
  });
}
