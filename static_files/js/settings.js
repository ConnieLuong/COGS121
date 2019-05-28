$(document).ready(function () {
    $.ajax({
        url: 'getUser',
        type: 'GET', 
        data: JSON,
        success: (data) => {
            if(data.text == "Sign in"){ //no user signed in
                $(".noUser").show();
                $(".profile").hide();
            }else if(data.text == "Sign out"){ //a user is currently signed in
                $(".noUser").hide();
                $(".profile").show();
                console.log("Name: ", data.displayName);
                console.log("Email: ", data.email);
            }
        }
    });
    $('small').hide();

    $(".updateForm").submit(function(e) {
        e.preventDefault();
    });

    $(document).on('click', '#saveInfo', function(){
        var newName = $('#name').val();
        var newEmail = $('#email').val();

        //ajax call to update name and email
        $.ajax({
            url: 'updateProfile',
            type: 'POST', 
            data: {
                    newName: newName,   //if pass in "" then that means no need to update
                    newEmail: newEmail
                },
            success: (data) => {
                console.log(data);
                $("#message").html(data.message); //show on UI success message
                $("#message").show();
            },
            error: (data) => {
                console.log(data);
                $("#message").html(data.message); //show on UI error message
                $("#message").show();
            }
        });
    });

    $(document).on('click', '#changePassword', function(){
        var newPassword = $('#newPassword').val();
        var confirmPassword = $('#confirmPassword').val();

        if(newPassword === confirmPassword){
            //ajax call to update password
            $.ajax({
                url: 'changePassword',
                type: 'POST', 
                data: {
                        newPassword: newPassword
                    },
                success: (data) => {
                    console.log(data);
                    $("#message").html(data.message); //show on UI success message
                    $("#message").show();
                },
                error: (data) => {
                    console.log(data);
                    $("#message").html(data.message); // show on UI error message
                    $("#message").show();
                }
            });
        }else{
            alert("Passwords do not match");
        }
    });
});