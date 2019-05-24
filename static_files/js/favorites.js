$(document).ready(function () {
    //tip-template
    const tt_template = Handlebars.compile($("#tip-template").html());

    //tip-content-template
    const tc_template = Handlebars.compile($("#tip-content-template").html());

    //showing tips by default
    console.log("loading in favorite tips by default");
    $.ajax({
        url: "getFavorite",
        type: "POST",
        data: {
            collection: "tips"
        }
    })
        .done(function (data) {
            console.log(data);
            Object.keys(data).forEach(e => {
                var html = tt_template(data[e]);
                $(".feed").append(html);
            });
            console.log("done loading tips");
        })
        .fail(function (data) {
            console.log("Please sign in to see favorites");
            $("#overlay").css("display", "block");
        });

    $(".filter").click(function (e) {
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
                .done(function (data) {
                    console.log(data);
                    Object.keys(data).forEach(e => {
                        var html = tt_template(data[e]);
                        $(".feed").append(html);
                    });
                    console.log("done loading tips");
                })
                .fail(function (data) {
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
                    console.log("aaa");
                },
                error: data => {
                    console.log(data.message);
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
                .done(function (data) {
                    console.log("done songs");
                    console.log(data);
                    _.each(function (e) {
                        var html = tt_template(e);
                        $(".feed").append(html);
                    });
                })
                .fail(function (data) {
                    console.log(data.message);
                });
        }
    });

    $(document).on("click", ".card-img-top", function (event) {
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
            database.ref("tips/" + tipNum).once("value", function (snapshot) {
                const data = snapshot.val();
                var html = tc_template(data);
                $("#" + tipNum + "card").append(html);
            });
        }
    });
});

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
