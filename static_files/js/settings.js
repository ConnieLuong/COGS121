$(document).ready(function () {
    $(document).on('click', '#saveInfo', function(){
        var newName = $('#name').val();
        var newEmail = ($('#email').val() == "") ? a : b ;

        //ajax call to update name and email
    });

    $(document).on('click', '#changePassword', function(){
        var newPassword = $('#newPassword').val();
        var confirmPassword = $('#confirmPassword').val();

        if(newPassword === confirmPassword){
            //ajax call to update password
        }else{
            alert("Passwords do not match");
        }
    });


});