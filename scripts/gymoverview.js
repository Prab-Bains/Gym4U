let gymName = localStorage.getItem("gymName");
console.log(gymName)

db.collection("gyms").where("name", "==", gymName)
    .get()
    .then(querygyms => {
        //see how many results you have got from the query
        size = querygyms.size;
        // get the documents of query
        Gyms = querygyms.docs;

        // We want to have one document per hike, so if the the result of
        //the query is more than one, we can check it right now and clean the DB if needed.
        if (size = 1) {
            var thisGym = Gyms[0].data();
            name = thisGym.name;
            image = thisGym.image;
            description = thisGym.description;
            equipment = thisGym.equipment;
            document.getElementById("GymName").innerHTML = name;
            document.getElementById("description").innerHTML = description;

            for (let i = 0; i < equipment.length; i++) {
                document.getElementById("item1").innerHTML = equipment[0];
                document.getElementById("item2").innerHTML = equipment[1];
                document.getElementById("item3").innerHTML = equipment[2];
                document.getElementById("item4").innerHTML = equipment[3];
            }

        } else {
            console.log("Query has more than one data")
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

db.collection("Reviews").where("code", "==", gymName)
    .get()
    .then(allReviews => {
        allReviews.forEach(doc => {
            var title = doc.data().Title; //gets the name field
            var review = doc.data().Description; //gets the image field

            var review_form =
                `<div class="card">
                <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <br>
                <p class="card-text">${review}</p>
                </div>
                </div>`
            $(".card-group").append(review_form);
        })

    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
