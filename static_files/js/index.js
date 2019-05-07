$(document).ready(function () {
    if(true){
        emptyDB();
        fillDB();
    }

    //tip-template
    var tt_template = Handlebars.compile($('#tip-template').html());

    //tip-content-template
    var tc_template = Handlebars.compile($('#tip-content-template').html());

    //load all tips onto the page
    database.ref('tips/').once('value', (snapshot) => {
        const data = snapshot.val();

        //for each tip entry in the tips collection, template it and append to class .feed
        _.each(data, function(e){
            var html = tt_template(e);
            $('.feed').append(html);
        });
    });

    //When click on DOM element with class .tip, grab its content from the database and append
    $('.tip').click( function(event){
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


    //Hardcode database -- for now
    function emptyDB(){
        console.log('Emptying the database of tips collection');
        database.ref('tips/').remove(); // delete the entire collection
    };

    function fillDB(){
        console.log('Filling the database with tips collection');
        database.ref('tips/tip01').set({tip_num: "01", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'Making Milk', tip_text: '3 easy steps and things to look out for'});
        database.ref('tips/tip02').set({tip_num: "02", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'Don\'t be Afraid', tip_text: 'You\'re not alone. Let\'s tackle PPD together'});
        database.ref('tips/tip03').set({tip_num: "03", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'Helping Out', tip_text: 'It is time to show off your skills.'});
        database.ref('tips/tip04').set({tip_num: "04", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'Changing Diapers', tip_text: 'It\s now or never.'});
        database.ref('tips/tip05').set({tip_num: "05", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: '10 Things New Dads should look out for', tip_text: 'You probably hadn\'t thought about this'});
        database.ref('tips/tip06').set({tip_num: "06", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'About Sleep', tip_text: 'Sleep will be valuable. You know it.'});
        database.ref('tips/tip07').set({tip_num: "07", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'Don\'t be Afraid', tip_text: 'You\'re not alone. Let\'s tackle PPD together'});
        database.ref('tips/tip08').set({tip_num: "08", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'Helping Out', tip_text: 'It is time to show off your skills.'});
        database.ref('tips/tip09').set({tip_num: "09", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'Changing Diapers', tip_text: 'It\s now or never.'});
        database.ref('tips/tip10').set({tip_num: "10", tip_img: 'http://placehold.jp/cccccc/cccccc/320x240.png', tip_title: 'Don\'t be Afraid', tip_text: 'You\'re not alone. Let\'s tackle PPD together'});
    };
});
