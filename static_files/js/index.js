$(document).ready(function () {
    //tip-template
    const tt_template = Handlebars.compile($('#tip-template').html());

    //tip-content-template
    const tc_template = Handlebars.compile($('#tip-content-template').html());

    var tipDayIndex = 'tip04';

    //Show Trending items by default
    database.ref('tips/').once('value', function (snapshot){
        //load tip of the day
        const tips = snapshot.val();
        console.log("tips: ", tips);
        $('.tipDay').append('<h1>Tip of the Day</h1>');
        $('.tipDay').append(tt_template(tips[tipDayIndex]));
        $('.feed').append('<h2>Other tips</h1>');

        //load all tips containing Trending tag
        const data = _.chain(tips)
            .filter(function(tip){
                const tip_tags = tip.tip_tags;
                return (tip_tags) ? tip_tags.includes("Trending") : false ;
            })
            .each(function(e){
                if(parseInt(e.tip_num) != parseInt(tipDayIndex.substring(3,tipDayIndex.length))){ //want to avoid repeat with tip of the day
                    var html = tt_template(e);
                    $('.feed').append(html);
                }
            }).value();
        console.log(data);
    });

    //When click on a tip card image, show its content
    $(document).on("click", ".card-img-top", function(event){
        console.log("clicking a tip");
        const tipNum = event.target.id;
        console.log(tipNum);
        //if content not showing, show content. Else remove.
        if(event.target.classList.contains("showing")){
            event.target.classList.remove("showing");
            $('#'+tipNum+'content').remove();
        }else{
            //mark element as showing
            event.target.classList.add("showing");
            database.ref('tips/'+tipNum).once('value', function (snapshot){
                const data = snapshot.val();
                var html = tc_template(data);
                $('#'+tipNum+'card').append(html);
            });
        }
    });

    $('body').click( function(event){
        console.log("====> ", event.target.className);
    })

    //Filters
    $('.filter').click( function (event){
        $('.feed').html('');
        const filter = event.target.id;
        //for each filter button, remove active_filter
        $('button').removeClass("active_filter");
        //add active_filter to clicked button
        event.target.classList.add("active_filter");

        //load filtered items
        database.ref('tips/').once('value', function (snapshot){
            //if filter is Trending, load tip of the day & other tips header
            if(filter=="Trending"){
                $('.tipDay').append('<h1>Tip of the Day</h1>');
                $('.tipDay').append(tt_template(snapshot.val()[tipDayIndex]));
                $('.feed').append('<h2>Other tips</h1>');
            }else{
                $('.tipDay').html('');
            }

            //filter and append only those that contain tag "filter"
            const data = _.chain(snapshot.val())
                .filter(function(tip){
                    const tip_tags = tip.tip_tags;
                    return (tip_tags) ? tip_tags.includes(filter) : false;
                })
                .each(function(e){
                    if(filter=="Trending" && parseInt(e.tip_num) == parseInt(tipDayIndex.substring(3,tipDayIndex.length))){
                        return;
                    }else{
                        var html = tt_template(e);
                        $('.feed').append(html);
                    }
                }).value();
            console.log(data);
        });
    });

    //Favorites
    $(document).on("click", ".favorite", function(event){
        console.log("attempting to favorite...");
        $.ajax({
            url: 'favorite',
            type: 'POST', 
            data: {
                    collection: 'tips',
                    item: event.target.id
                  },
            success: (data) => {
                console.log(data);
                console.log(data.message);
                alert(data.message);
            },
            error: (data) => {
                console.log(data.message);
                alert(data.message);
            }
        });
    });
});