//------------------------------------------------
// javascript for updating user info
//------------------------------------------------
var currentUser

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

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.git pi
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    console.log(userName);
                    var userBirthday = userDoc.data().userBirthday;
                    var userEmail = userDoc.data().email;
                    var userCity = userDoc.data().city;
                    var userType = userDoc.data().usertype;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userBirthday != null) {
                        document.getElementById("birthdayInput").value = userBirthday;
                    }
                    if (userEmail != null) {
                        document.getElementById("emailInput").value = userEmail;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userType != null) {
                        document.querySelector('input[name="userType"]:checked').value = userType;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it
populateInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    //console.log("Save is clicked")
    //grab info that user input in each field
    userName = document.getElementById('nameInput').value;
    userBirthday = document.getElementById('birthdayInput').value;
    userEmail = document.getElementById('emailInput').value;
    userCity = document.getElementById('cityInput').value;
    userType = document.querySelector('input[name="userType"]:checked').value;

    //console.log("Values are:", userName, userSchool, UserCity)
    //write the values in the database:
    currentUser.set({
        name: userName,
        birthday: userBirthday,
        email: userEmail,
        city: userCity,
        type: userType
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
    document.getElementById('personalInfoFields').disabled = true;

}

//------------------------------------------------
// javascript for updating user profile pic
//------------------------------------------------