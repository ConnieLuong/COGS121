$(document).ready(function() {
  //tip-template
  const tt_template = Handlebars.compile($("#tip-template").html());

  //tip-content-template
  const tc_template = Handlebars.compile($("#tip-content-template").html());

  //story-template
  const s_template = Handlebars.compile($("#story-template").html());

  const song_template = Handlebars.compile($("#song-template").html());

  //showing tips by default
  console.log("loading in favorite tips by default");
  /* database.ref("/stories").once("value", snapshot => {
    const stories = snapshot.val();
    let counter = 0;
    stories.forEach(e => {
      e["story_img"] = "./img/story/" + counter + ".jpg";
      if (counter == 3) {
        counter = 0;
      } else {
        counter++;
      }
    });
    database.ref("/stories").set(stories);
  });
  */
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
    } else if (filter == "Stories") {
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
    } else {
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
    } else {
      //mark element as showing
      event.target.classList.add("showing");
      database.ref("tips/" + tipNum).once("value", function(snapshot) {
        const data = snapshot.val();
        var html = tc_template(data);
        $("#" + tipNum + "card").append(html);
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
/*  database.ref("tips/").once("value", function(t) {
    const data = t.val();
    const test = ["tip04", "tip06"];

    const filtered = _.chain(Object.keys(data))
      .filter(function(key) {
        return test.includes(key);
      })
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {})
      .value();

      Object.keys(data)
      .filter(key => test.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    console.log(filtered);
  }); */
