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
            }else if (data.text == "Sign in"){
                $('.signinNav').html(data.text);
                $('.signinNav').removeClass('signoutNav');
                $('.signinNav').attr('href', './signin.html');
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


    })
});