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
function showUpdloadedPicture() {
    const fileInput = document.getElementById("mypic-input"); // pointer #1
    const image = document.getElementById("mypic-goes-here"); // pointer #2

    //attach listener to input file
    //when this file changes, do something
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {

            //the change event returns a file "e.target.files[0]"
            var newpic = URL.createObjectURL(e.target.files[0]);

            //change the DOM img element source to point to this file
            image.src = newpic; //assign the "src" property of the "img" tag
        })
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        fileButton.addEventListener('change', function (e) {       //event listener
            const pickedfile = e.target.files[0];  // file that user picked
            image.src = URL.createObjectURL(pickedfile); //event handler
        })
    } else {
        // No user is signed in.
    }
});

var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg"); // Get reference
// Upload picked file to cloud storage
storageRef.put(pickedfile)
    .then(function () {
        storageRef.getDownloadURL()
            .then(function (url) { // Get URL of the uploaded file
                console.log(url); // Save the URL into users collection
                db.collection("users").doc(user.uid).update({
                    "profile-pic": url
                })
            })
    })

function uploadUserProfilePic() {
    // Let's assume my storage is only enabled for authenticated users
    // This is set in your firebase console storage "rules" tab

    firebase.auth().onAuthStateChanged(function (user) {
        var fileInput = document.getElementById("mypic-input");   // pointer #1
        const image = document.getElementById("mypic-goes-here"); // pointer #2

        // listen for file selection
        fileInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var blob = URL.createObjectURL(file);
            image.src = blob;            // display this image

            //store using this name
            var storageRef = storage.ref("images/" + user.uid + ".jpg");

            //upload the picked file
            storageRef.put(file)
                .then(function () {
                    console.log('Uploaded to Cloud Storage.');
                })

            //get the URL of stored file
            storageRef.getDownloadURL()
                .then(function (url) {   // Get URL of the uploaded file
                    console.log(url);    // Save the URL into users collection
                    db.collection("users").doc(user.uid).update({
                        "profilePic": url
                    })
                        .then(function () {
                            console.log('Added Profile Pic URL to Firestore.');
                        })
                })
        })
    })
}
uploadUserProfilePic();

function displayUserProfilePic() {
    console.log("hi");
    firebase.auth().onAuthStateChanged(function (user) {      //get user object
        db.collection("users").doc(user.uid)                  //use user's uid
            .get()                                            //READ the doc
            .then(function (doc) {
                var picUrl = doc.data().profilePic;           //extract pic url

                // use this line if "mypic-goes-here" is an "img"
                $("#mypic-goes-here").attr("src", picUrl);
            })
    })
}
displayUserProfilePic();