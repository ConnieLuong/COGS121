$(document).ready(function() {
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
      }
    });
  });
});
