$(document).ready(function() {
  //on load, load correct favorite icon
  $.ajax({
    url: "getFavorite",
    type: "POST",
    data: { collection: "stories" },
    success: function(data) {
      console.log("clicking on tips. need to check if favorited: ", data);
      var userFavStories = Object.keys(data);

      console.log(userFavStories);

      //if a user is signed in and current tip is in their favorites
      setTimeout(() => {
        const story_num = document.getElementsByClassName("favorite")[0].id;
        console.log(story_num);
        if (userFavStories.length > 0 && userFavStories.includes(story_num)) {
          $(".favorite").html('<i class="fas fa-star fa-fw"></i> Favorited');
        }
      }, 800);
    }
  });

  var url = document.location.href,
    queryString = decodeURIComponent(url.split("?")[1]);

  console.log(queryString);
  const story_name = queryString.split("=")[1];
  console.log(story_name);
  $("#story_name").html(story_name);

  database.ref("stories/").once("value", function(snapshot) {
    const stories = snapshot.val();
    stories.forEach(e => {
      if (e.Name == story_name) {
        $("#story_content").html(e.Content);
        $(".favorite").attr("id", e["No"]);
      }
    });
  });
});
