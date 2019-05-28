$(document).ready(function () {
    const tt_template = Handlebars.compile($('#tip-template').html()); //tip-template    
    const tc_template = Handlebars.compile($('#tip-content-template').html()); //tip-content-template

    //load trending tips on page load
    loadFilteredTips("Trending", tt_template);

    //When click on a tip card image, show its content
    $(document).on("click", ".card-img-top", function (event) {
        const tipNum = event.target.id;
        console.log("clicking a tip:", event.target.id);

        //if content is showing, don't show content.
        if (event.target.classList.contains("showing")) {
            event.target.classList.remove("showing");
            $('#' + tipNum + 'content').remove();
        }
        //else mark element as showing & show content
        else {
            event.target.classList.add("showing");
            showTipContent(tipNum, tc_template);

            //check if tip is favorited
            $.ajax({
                url: 'getFavorite',
                type: 'POST',
                data: { collection: "tips" },
                success: function (data) {
                    console.log("Checking if ", tipNum, " is favorited: ", data);
                    var userFavTips = Object.keys(data);
                    //if a user is signed in and current tip is in their favorites
                    if (userFavTips.length > 0 && userFavTips.includes(tipNum)) {
                        $('.favorite').html('<i class="fas fa-star fa-fw"></i> Favorited');
                    }
                },
            });
        }
    });

    //Filters
    $('.filter').click(function (event) {
        //clear feed
        $('.feed').html('');

        //for each filter button, remove active_filter; add active_filter to clicked button
        $('button').removeClass("active_filter");
        event.target.classList.add("active_filter");

        //load filtered tips
        const filter = event.target.id;
        loadFilteredTips(filter, tt_template);
    });
});

function loadFilteredTips(filter, tt_template) {
    var tipDayIndex = 'tip04';
    $.ajax({
        url: 'tips',
        type: 'GET',
        data: JSON,
        success: function (data) {
            var tips = data;

            //if filter is Trending, load 'tip of the day' & 'other tips' header
            if (filter == "Trending") {
                $('.tipDay').append('<h1>Tip of the Day</h1>');
                $('.tipDay').append(tt_template(tips[tipDayIndex]));
                $('.feed').append('<h2>Other tips</h1>');
            } else {
                $('.tipDay').html('');
            }

            //filter and append only those that contain appropriate filter tag
            const res = _.chain(tips)
                .filter(function (tip) {
                    const tip_tags = tip.tip_tags;
                    return (tip_tags) ? tip_tags.includes(filter) : false;
                })
                .each(function (e) {
                    if (filter == "Trending" && parseInt(e.tip_num) == parseInt(tipDayIndex.substring(3, tipDayIndex.length))) {
                        return;
                    } else {
                        var html = tt_template(e);
                        $('.feed').append(html);
                    }
                }).value();
            console.log("Tips for filter ", filter, ":", res);
        },
    });
}

function showTipContent(tipNum, tc_template){
    $.ajax({
        url: 'tips',
        type: 'GET',
        data: JSON,
        success: function (data) {
            var tips = data;
            var html = tc_template(tips[tipNum]);
            $('#' + tipNum + 'card').append(html);
        },
    });
}