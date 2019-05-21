$(document).ready(function () {
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