$(document).ready(function() {
  //tip-template
  const tt_template = Handlebars.compile($("#tip-template").html());

  //tip-content-template
  const tc_template = Handlebars.compile($("#tip-content-template").html());

  //showing
  database.ref("users/");

  $(".filter").click(function(e) {
    $(".feed").empty();
    const filter = event.target.id;
    //for each filter button, remove active_filter
    $("button").removeClass("active_filter");
    //add active_filter to clicked button
    event.target.classList.add("active_filter");

    database.ref("users/").once("value", function(snapshot) {
      if (filter == "Tips") {
        console.log("attempting to get favorite tips");
        $.ajax({
          url: "favorite",
          type: "GET",
          data: {
            collection: "tips"
          }
        })
          .done(function(data) {
            console.log(data);
            _.each(function(e) {
              var html = tt_template(e);
              $(".feed").append(html);
            });
          })
          .fail(function(data) {
            console.log(data.message);
            alert(data.message);
          });
      } else if (filter == "stories") {
        console.log("attempting to get favorite stories");
        $.ajax({
          url: "favorite",
          type: "GET",
          data: {
            collection: "stories"
          }
        })
          .done(function(data) {
            console.log(data);
            _.each(function(e) {
              var html = tt_template(e);
              $(".feed").append(html);
            });
          })
          .fail(function(data) {
            console.log(data.message);
            alert(data.message);
          });
      } else {
        console.log("attempting to get favorite songs");
        $.ajax({
          url: "favorite",
          type: "GET",
          data: {
            collection: "songs"
          }
        })
          .done(function(data) {
            console.log(data);
            _.each(function(e) {
              var html = tt_template(e);
              $(".feed").append(html);
            });
          })
          .fail(function(data) {
            console.log(data.message);
            alert(data.message);
          });
      }
    });
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
