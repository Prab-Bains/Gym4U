let gymID = localStorage.getItem("gymID");
console.log(gymID)

function move_to_listings() {
    var link = 'listings.html'
    location.replace(link);
}

db.collection("gyms").where("name", "==", gymID)
    .get()
    .then(querygyms => {
        //see how many results you have got from the query
        size = querygyms.size;
        // get the documents of query
        Gyms = querygyms.docs;

        // We want to have one document per gym, so if the the result of 
        //the query is more than one, we can check it right now and clean the DB if needed.
        if (size = 1) {
            var thisGym = Gyms[0].data();
            name = thisGym.name;
            document.getElementById("GymName").innerHTML = name;
        } else {
            console.log("Query has more than one data")
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


function writeReview() {
    let Title = document.getElementById("title").value;
    let Description = document.getElementById("description").value;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    // Start a new collection and add all data in it.
                    db.collection("Reviews").add({
                        code: gymID,
                        UserID: userID,
                        Title: Title,
                        Description: Description
                    });

                })
        } else {
            // No user is signed in.
            console.log("no user signed in");
        }
    });
    alert("Your review was successfully submited");
}
