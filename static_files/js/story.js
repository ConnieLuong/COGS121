/**
 * File: story.js
 * Description: Contains the logic for loading in specific story name
 *              and content based on the data passed from the url
 * Author: Hao-In Choi
 */
$(document).ready(function() {
  //decoding the the info in url
  var url = document.location.href,
    queryString = decodeURIComponent(url.split("?")[1]);

  console.log(queryString);
  const story_name = queryString.split("=")[1];
  console.log(story_name);
  $("#story_name").html(story_name);

  //calling first ajax call to get the favorite button id
  $.ajax({
    url: "stories",
    type: "GET",
    data: JSON,
    success: function(data) {
      data.forEach(e => {
        if (e.Name == story_name) {
          $("#story_content").html(e.Content);
          $(".favorite").attr("id", e["No"]);
        }
      });
    }
  });

  //on load, load correct favorite icon
  $.ajax({
    url: "getFavorite",
    type: "POST",
    data: { collection: "stories" },
    success: function(data) {
      var userFavStories = Object.keys(data);

      console.log(userFavStories);

      //if a user is signed in and current tip is in their favorites
      // need to wait for the ajax call done because the checking required the id of the story
      setTimeout(() => {
        const story_num = $(".favorite").attr("id");
        console.log(story_num);
        if (userFavStories.length > 0 && userFavStories.includes(story_num)) {
          $("button.favorite").html(
            '<i class="fas fa-star fa-fw"></i> Favorited'
          );
        }
      }, 2000);
    }
  });
});
