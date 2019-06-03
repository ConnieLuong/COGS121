/**
 * File: signin.js
 * Description: Signs user in or signs user up based on the 
 *              form information submitted. Also logic to change UI/form
 *              displayed based on the tab user clicks on.
 * Author: Connie Luong
 */
$(document).ready(function () {
    $('#message').hide();
    //show sign in form initially
    $('.signin').css("display", "initial");
    $('.signup').css("display", "none");
    $('.signinTab').addClass('activeTab');
    $('.signupTab').removeClass('activeTab');
    
    //sign in & sign up tab switching
    $(document).on("click", ".signinTab", function(event){
        $('.signin').css("display", "inline");
        $('.signup').css("display", "none");
        $('.signinTab').addClass('activeTab');
        $('.signupTab').removeClass('activeTab');
    });
    $(document).on("click", ".signupTab", function(event){
        $('.signin').css("display", "none");
        $('.signup').css("display", "inline");
        $('.signinTab').removeClass('activeTab');
        $('.signupTab').addClass('activeTab');
    });

    //sign in
    $(document).on("click", "#signinButton", function(event){
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
                location.href = "./index.html";
            },
            error: (data) => {
                console.log(data.responseJSON.message);
                alert(data.responseJSON.message);
            }
        });
        return false; //prevents refresh
    });   
    
    //sign up
    $(document).on("click", "#signupButton", function(event){
        $('#message').show();
        $('#message').html('Signing up...');
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
                // window.location.href = "./index.html";
                document.location.assign('./index.html');
            },
            error: (data) => {
                console.log(data.responseJSON.message);
                alert(data.responseJSON.message);
            }
        });
    }); 
    
    $("#signupPassword").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#signupButton").click();
        }
    });
});