$(document).ready(function () {
    //on page load grab all objects from tips collection and load into cards
    database.ref('tips/').once('value', (snapshot) => {
        const feed = snapshot.val();
        console.log('You received some data!', feed);
        if(feed){
            //for each tips in feed append to feed
            _.each(feed, function(tip){
                if(tip){
                    $('.feed').append(
                        '<div class="col-sm-12 col-md-4">'+
                            '<a href="'+ tip.link +'" class="btn btn-primary">'+
                                '<div class="card text-dark">'+
                                    '<img class="card-img" src="'+ tip.img +'">'+
                                    '<div class="card-img-overlay">'+
                                        '<h5 class="card-title">'+ tip.title +'</h5>'+
                                        '<p class="card-text">'+ tip.text + '</p>'+
                                        '<i class="far fa-heart"></i><i class="far fa-share-square"></i>'+
                                    '</div>'+
                                '</div>'+
                            '</a>'+
                        '</div>'
                    );
                }
            });
        }else{
            //empty feed
            $('.feed').append("<p>Empty Feed. Nothing in Database</p>");
        }
    });
    

    //Hardcode database -- for testing
    $('#emptyDB').click(() => {
        console.log('Emptying the database of tips collection');
        database.ref('tips/').remove(); // delete the entire collection
    });

    $('#fillDB').click(() => {
        console.log('Filling the database with tips collection');
        database.ref('tips/1').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Making Milk', text: '3 easy steps and things to look out for', link: '../tips.html'});
        database.ref('tips/2').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Don\'t be Afraid',   text: 'You\'re not alone. Let\'s tackle PPD together', link: '../tips.html'});
        database.ref('tips/3').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Helping Out',  text: 'It is time to show off your skills.', link: '../tips.html'});
        database.ref('tips/4').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Changing Diapers',  text: 'It\s now or never.', link: '../tips.html'});
        database.ref('tips/5').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: '10 Things New Dads should look out for',  text: 'You probably hadn\'t thought about this', link: '../tips.html'});
        database.ref('tips/6').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'About Sleep',  text: 'Sleep will be valuable. You know it.', link: '../tips.html'});
        database.ref('tips/7').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Don\'t be Afraid',   text: 'You\'re not alone. Let\'s tackle PPD together', link: '../tips.html'});
        database.ref('tips/8').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Helping Out',  text: 'It is time to show off your skills.', link: '../tips.html'});
        database.ref('tips/9').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Changing Diapers',  text: 'It\s now or never.', link: '../tips.html'});
        database.ref('tips/10').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Don\'t be Afraid',   text: 'You\'re not alone. Let\'s tackle PPD together', link: '../tips.html'});
        database.ref('tips/11').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Helping Out',  text: 'It is time to show off your skills.', link: '../tips.html'});
        database.ref('tips/12').set({img: 'http://placehold.jp/cccccc/cccccc/320x240.png', title: 'Changing Diapers',  text: 'It\s now or never.', link: '../tips.html'});
    });
});
