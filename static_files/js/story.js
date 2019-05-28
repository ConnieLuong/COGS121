$(document).ready(function() {
  //on load, load correct favorite icon
  $.ajax({
    url: "getFavorite",
    type: "POST",
    data: { collection: "tips" },
    success: function(data) {
      console.log("clicking on tips. need to check if favorited: ", data);
      var userFavTips = Object.keys(data);
      //if a user is signed in and current tip is in their favorites
      if (userFavTips.length > 0 && userFavTips.includes(tipNum)) {
        $(".favorite").html('<i class="fas fa-star fa-fw"></i> Favorited');
      }
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
