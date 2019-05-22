$(document).ready(function () {
    //show sign in form initially
    $('.signin').css("display", "initial");
    $('.signup').css("display", "none");
    $('.signinTab').addClass('activeTab');
    $('.signupTab').removeClass('activeTab');
    
    //sign in
    $(document).on("click", ".signinTab", function(event){
        $('.signin').css("display", "initial");
        $('.signup').css("display", "none");
        $('.signinTab').addClass('activeTab');
        $('.signupTab').removeClass('activeTab');
    });

    $(document).on("click", "#signinButton", function(event){
        console.log('signing in...');
        $.ajax({
            url: 'signin',
            type: 'POST', 
            data: {
                    email: $('#signinEmail').val(),
                    password: $('#signinPassword').val()
                  },
            success: (data) => {
              console.log("User successfully signed in");
              //redirect to home page
            },
            error: (data) => {
                console.log(data.responseJSON.message);
                alert(data.responseJSON.message);
            }
        });
        return false; //prevents refresh
    });   
    
    //sign up
    $(document).on("click", ".signupTab", function(event){
        $('.signin').css("display", "none");
        $('.signup').css("display", "initial");
        $('.signinTab').removeClass('activeTab');
        $('.signupTab').addClass('activeTab');
    });
    
    $(document).on("click", "#signupButton", function(event){
        console.log('signing up...');
        $.ajax({
            url: 'signup',
            type: 'POST', 
            data: {
                    email: $('#signupEmail').val(),
                    password: $('#signupPassword').val(),
                    displayName: $('#signupName').val()
                  },
            success: (data) => {
              console.log('User sign up successful');
              //redirect to home page
            },
            error: (data) => {
                console.log(data.responseJSON.message);
                alert(data.responseJSON.message);
            }
        });
        return false; //prevents refresh
    });    
});