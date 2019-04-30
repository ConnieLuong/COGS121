$(document).ready(function () {
  $('#resetButton').click(() => {
      console.log('Resetting the database');
      database.ref('users/').remove(); // delete the entire collection
      // writes data to the database:
      database.ref('users/Philip').set({job: 'professor', pet: 'cat.jpg'});
      database.ref('users/John').set({job: 'student',   pet: 'dog.jpg'});
      database.ref('users/Carol').set({job: 'engineer',  pet: 'bear.jpg'});
  });
});