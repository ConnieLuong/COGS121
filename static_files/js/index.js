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
                        '<div class="col-sm-12 col-md-6">'+
                            '<div class="card">'+
                                '<img class="card-img-top" src="'+ tip.img +'">'+
                                '<div class="card-body">'+
                                    '<h5 class="card-title">'+ tip.title +'</h5>'+
                                    '<p class="card-text">'+ tip.text + '</p>'+
                                    '<a href="'+ tip.link +'" class="btn btn-primary">Read more</a>'+
                                '</div>'+
                            '</div>'+
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
        database.ref('tips/1').set({img: 'https://via.placeholder.com/150x75', title: 'Making Milk', text: '3 easy steps and things to look out for', link: '#'});
        database.ref('tips/2').set({img: 'https://via.placeholder.com/150x75', title: 'Don\'t be Afraid',   text: 'You\'re not alone. Let\'s tackle PPD together', link: '#'});
        database.ref('tips/3').set({img: 'https://via.placeholder.com/150x75', title: 'Helping Out',  text: 'It is time to show off your skills.', link: '#'});
        database.ref('tips/4').set({img: 'https://via.placeholder.com/150x75', title: 'Changing Diapers',  text: 'It\s now or never.', link: '#'});
        database.ref('tips/5').set({img: 'https://via.placeholder.com/150x75', title: '10 Things New Dads should look out for',  text: 'You probably hadn\'t thought about this', link: '#'});
        database.ref('tips/6').set({img: 'https://via.placeholder.com/150x75', title: 'About Sleep',  text: 'Sleep will be valuable. You know it.', link: '#'});

    });
});
