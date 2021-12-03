// Inserts name into the spaces in the html where "name-goes-here" is the ID

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Do something for the current logged-in user here:
            console.log(user.uid);
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userName = userDoc.data().name;
                    console.log(userName);
                    //method #1:  insert with html only
                    //document.getElementById("name-goes-here").innerText = n;    //using javascript
                    //method #2:  insert using jquery
                    $("#name-goes-here").text(userName);                         //using jquery
                })
        } else {
            // No user is signed in.
        }
    });
}
insertName();