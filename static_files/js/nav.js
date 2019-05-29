function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

$(document).ready(function () {
    //update navbar on load
    $.ajax({
        url: 'getUser',
        type: 'GET', 
        data: JSON,
        success: (data) => {
            if(data.text=="Sign out"){
                $('.signinNav').html(data.text);
                $('.signinNav').addClass('signoutNav');
                $('.signinNav').attr('href', '#');
                $('#greeting').html("Hey, <br>"+data.displayName+"!");
            }else if (data.text == "Sign in"){
                $('.signinNav').html(data.text);
                $('.signinNav').removeClass('signoutNav');
                $('.signinNav').attr('href', './signin.html');
                $('#greeting').html("Hi there!");
            }
        },
        error: (data) => {
            console.log("Error from get request to isUserSignedin");
        }
    });

    //sign out
    $(document).on('click', '.signoutNav', function(event){
        console.log(event.target.classList);
        $.ajax({
            url: 'signOut',
            type: 'GET', 
            data: JSON,
            success: (data) => {
                console.log("successful sign out");
                location.href = "./signin.html";
            }
        });


    });

    $('body').click(function(event){
        console.log(event.target.id);
    });

    $(document).on('click', '#query', function(event){
        $('#logo').fadeOut(150);
    });
    $(document).on('click', 'body', function(event){
        if(event.target.id != 'query'){
            $('#logo').delay(500).fadeIn();
        }
    });

    //search
    $("form#search-bar").on("submit", function(e) {
        e.preventDefault(); //prevents refresh
        var query = $('#query').val(); 
        localStorage.setItem("query",query); //store query so can use when go to searchResults page
        location.href = "./searchResults.html"; //redirect to search results page
    });
});