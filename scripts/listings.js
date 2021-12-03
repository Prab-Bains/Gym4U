function move_to_gym_overview() {
    var link = 'gymOverview.html'
    location.replace(link);
}

function displayGyms() {
    // let hikeCardTemplate = document.getElementById("hikeCardTemplate");
    // let hikeCardGroup = document.getElementById("gymCardGroup");

    db.collection("gyms").get()
        .then(allGyms => {
            allGyms.forEach(doc => {
                var gymName = doc.data().name; //gets the name field
                var gymImage = doc.data().image; //gets the image field
                var gymAddress = doc.data().address; //gets the description field
                var gymDescription = doc.data().description; //gets the description field

                var template_form =
                    `<div class="card">
                        <img class="card-img-top" src="./images/${gymImage}.jpg">
                        <img class="card-img-top width=100px height=100px">
                        <div class="card-body">
                        <h5 class="card-title" id="id_${gymName}">${gymName}</h5>
                        <p class="card-address">${gymAddress}</p>
                        <p class="link-primary" onclick="gotoReview('${gymName}')">Write a review</a>
                        <br>
                        <p class="card-text">${gymDescription}</p>
                        <a href="#" class="btn btn-primary" onclick="setGymData('${gymName}')" style="float: right"> Read
                            more</a>
                        </div>
                        </div>`
                $(".card-group").append(template_form);
            })

        })
}
displayGyms();

function setGymData(gymName) {
    console.log(gymName)
    localStorage.setItem('gymName', gymName);
    move_to_gym_overview()
    console.log("clicked")
}

function gotoReview(gymName) {
    console.log(gymName)
    localStorage.setItem('gymID', gymName);
    // location.replace("review.html")
    console.log(gymName)
    console.log("clicked")
    window.open('review.html', "_blank");

}

