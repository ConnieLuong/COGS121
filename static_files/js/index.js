$(document).ready(function () {
    //on page load grab all objects from tips collection and load into cards


    //quick test to see if database is connected properly
    $('#resetButton').click(() => {
        console.log('Resetting the database');
        database.ref('users/').remove(); // delete the entire collection
        // writes data to the database:
        database.ref('users/Philip').set({job: 'professor', pet: 'cat.jpg'});
        database.ref('users/John').set({job: 'student',   pet: 'dog.jpg'});
        database.ref('users/Carol').set({job: 'engineer',  pet: 'bear.jpg'});
    });
});
