$(document).ready(function () {
    //tip-template
    const tt_template = Handlebars.compile($('#tip-template').html());

    //tip-content-template
    const tc_template = Handlebars.compile($('#tip-content-template').html());

    var tipDayIndex = 'tip01';

    //Show Trending items by default
    database.ref('tips/').once('value', function (snapshot){
        //load tip of the day
        const tips = snapshot.val();
        console.log("tips: ", tips);
        $('.tipDay').append('<h1>Tips of the Day</h1>');
        const htmlTipDay = tt_template(tips[tipDayIndex]);
        $('.tipDay').append(htmlTipDay);
        $('.feed').append('<h2>Other tips</h1>');

        //load all tips containing Trending tag
        const data = _.chain(tips)
            .filter(function(tip){
                const tip_tags = tip.tip_tags;
                return tip_tags.includes("Trending");
            })
            .each(function(e){
                if(parseInt(e.tip_num) != (tipDayIndex+1)){ //want to avoid repeat with tip of the day
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
                    return tip_tags.includes(filter);
                })
                .each(function(e){
                    if(filter=="Trending" && parseInt(e.tip_num) == (tipDayIndex+1)){
                        return;
                    }else{
                        var html = tt_template(e);
                        $('.feed').append(html);
                    }
                }).value();
            console.log(data);
        });
    });

    //Hardcode database -- for now
    function emptyDB(){
        console.log('Emptying the database of tips collection');
        database.ref('tips/').remove(); // delete the entire collection
    };

    function fillDB(){
        console.log('Filling the database with tips collection');
        database.ref('tips/tip01').set({tip_num: "01", tip_img: 'http://placehold.jp/14/ffdb99/662900/320x240.png?text=placeholder%20image', tip_title: 'Making Milk baby', tip_text: '3 easy steps and things to look out for', tip_tags:['Baby']});
        database.ref('tips/tip02').set({tip_num: "02", tip_img: 'http://placehold.jp/14/d1de8e/006629/320x240.png?text=placeholder%20image', tip_title: 'Don\'t be Afraid parent', tip_text: 'You\'re not alone. Let\'s tackle PPD together', tip_tags:['Parent']});
        database.ref('tips/tip03').set({tip_num: "03", tip_img: 'http://placehold.jp/14/8e91de/1d0066/320x240.png?text=placeholder%20image', tip_title: 'Helping Out baby', tip_text: 'It is time to show off your skills.', tip_tags:['Baby']});
        database.ref('tips/tip04').set({tip_num: "04", tip_img: 'http://placehold.jp/14/ffdb99/662900/320x240.png?text=placeholder%20image', tip_title: 'Changing Diapers parent trending', tip_text: 'It\s now or never.', tip_tags:['Parent', 'Trending']});
        database.ref('tips/tip05').set({tip_num: "05", tip_img: 'http://placehold.jp/14/8e91de/1d0066/320x240.png?text=placeholder%20image', tip_title: '10 Things New Dads should look out for parent', tip_text: 'You probably hadn\'t thought about this', tip_tags:['Parent']});
        database.ref('tips/tip06').set({tip_num: "06", tip_img: 'http://placehold.jp/14/ffdb99/662900/320x240.png?text=placeholder%20image', tip_title: 'About Sleep baby trending', tip_text: 'Sleep will be valuable. You know it.', tip_tags:['Baby', 'Trending']});
        database.ref('tips/tip07').set({tip_num: "07", tip_img: 'http://placehold.jp/14/d1de8e/006629/320x240.png?text=placeholder%20image', tip_title: 'Don\'t be Afraid baby trending', tip_text: 'You\'re not alone. Let\'s tackle PPD together', tip_tags:['Baby', 'Trending']});
        database.ref('tips/tip08').set({tip_num: "08", tip_img: 'http://placehold.jp/14/8e91de/1d0066/320x240.png?text=placeholder%20image', tip_title: 'Helping Out parent', tip_text: 'It is time to show off your skills.', tip_tags:['Parent']});
        database.ref('tips/tip09').set({tip_num: "09", tip_img: 'http://placehold.jp/14/8e91de/1d0066/320x240.png?text=placeholder%20image', tip_title: 'Changing Diapers baby trending', tip_text: 'It\s now or never.', tip_tags:['Baby','Trending']});
        database.ref('tips/tip10').set({tip_num: "10", tip_img: 'http://placehold.jp/14/ffdb99/662900/320x240.png?text=placeholder%20image', tip_title: 'Don\'t be Afraid baby', tip_text: 'You\'re not alone. Let\'s tackle PPD together', tip_tags:['Baby']});
    };
});


