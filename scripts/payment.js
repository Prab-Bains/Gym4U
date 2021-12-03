function addCreditCard() {
    firebase.auth().onAuthStateChanged(user => { // check that a user is signed in
        if (user) {
            var uid = user.uid // get user id
            var currentDB = db.collection("creaditcards").doc(uid) // get collection (credit card lists)
            currentDB.get().then(doc => {
                if (doc.exists) {
                    var appointment_list = doc.data();
                    let lengthOfAppointmentList = Object.keys(appointment_list).length + 1;

                    // assign data collected from the form
                    let cardType = document.getElementById("cardtype_id").value;
                    let creditcardno = document.getElementById("creditcardno_id").value;
                    let cardname = document.getElementById("cardname_id").value;
                    let expiryDate = document.getElementById("expiry_id").value;
                    let cvv = document.getElementById("cvv_id").value;
                    let billing = document.getElementById("billing_id").value;
                    let pointer = 'a' + lengthOfAppointmentList // assign a unique id to each object
                    let new_appointment_list = appointment_list;
                    let new_appointment_info = new Object({ // get the original list from firebase
                        card_type: cardType,
                        credit_card_no: creditcardno,
                        card_name: cardname,
                        expiry_date: expiryDate,
                        cvv_number: cvv,
                        billing_info: billing
                    });
                    new_appointment_list[pointer] = new_appointment_info; // add new object to the original list
                    currentDB.set(new_appointment_list); // set new list if there is new current information in the list
                } else {
                    let cardType = document.getElementById("cardtype_id").value;
                    let creditcardno = document.getElementById("creditcardno_id").value;
                    let cardname = document.getElementById("cardname_id").value;
                    let expiryDate = document.getElementById("expiry_id").value;
                    let cvv = document.getElementById("cvv_id").value;
                    let billing = document.getElementById("billing_id").value;
                    let new_appointment_info = new Object({
                        'a1':
                        {
                        card_type: cardType,
                        credit_card_no: creditcardno,
                        card_name: cardname,
                        expiry_date: expiryDate,
                        cvv_number: cvv,
                        billing_info: billing
                        }
                    });
                    currentDB.set(new_appointment_info);
                }
            })

        } else {
            alert("no user sign-in");
        }
    })
    readCardList()
}

// print the current lists in the database to the screen
function readCardList() {
    $(".cardlist_container").empty();
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var uid = user.uid
            var currentDB = db.collection("creaditcards").doc(uid)
            currentDB.get().then(doc => {
                if (doc.exists) {
                    var appointment_list = doc.data();
                    const key_list = Object.keys(appointment_list);
                    let lengthOfAppointmentList = Object.keys(appointment_list).length; // get all of the users credit cards from the database

                    for (var i = lengthOfAppointmentList; i > 0; i--) { // append in reverse order to show the most recent first
                        pointer = 'a' + i;
                        card_name = appointment_list[pointer]['card_name'];
                        card_type = appointment_list[pointer]['card_type'];
                        credit_card_no = appointment_list[pointer]['credit_card_no'];
                        cvv_number = appointment_list[pointer]['cvv_number'];
                        expiry_date = appointment_list[pointer]['expiry_date'];
                        billing_info = appointment_list[pointer]['billing_info'];

                        // pointer used as an identifier for objects in firebase
                        var containerform =
                            `<div class="card text-white bg-secondary mb-5" id="${pointer}" style="max-width: 20rem;">
                                <div class="card-header" id="card_name_id_${pointer}">${card_name}</div>
                                    <div class="card-body">
                                        <span class="card-text">Card type:</span>
                                        <input type="text" id="card_type_id_${pointer}" value="${card_type}"></br>
                                        <span class="card-text">Card Number:</span>
                                        <input type="text" id="credit_card_no_id_${pointer}" value="${credit_card_no}"></br>
                                        <span class="card-text">CVV:</span>
                                        <input type="text" id="cvv_number_id_${pointer}" value="${cvv_number}"></br>
                                        <span class="card-text">Expiry date:</span>
                                        <input type="text" id="expiry_date_id_${pointer}" value="${expiry_date}"></br>
                                        <span class="card-text">Billing:</span>
                                        <input type="text" id="billing_info_id_${pointer}" value="${billing_info}"></br>
                                        <button id="deleteButton_${pointer}" class="btn btn-secondary" onclick="removeCreditCard(this.id)">Remove</button>
                                        <button id="deleteButton_${pointer}" class="btn btn-secondary" onclick="UpdateAppointment(this.id)">Update</button>
                                    </div>
                            </div>`;
                        $(".cardlist_container").append(containerform);
                    }
                } else {
                    console.log("No such data")
                }
            })
        } else {
            alert("no user sign-in");
        }
    })
}
readCardList();


function removeCreditCard(id) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var uid = user.uid
            var currentDB = db.collection("creaditcards").doc(uid)
            var target_object_key = id.slice(-2); //id.slice(-2) means 'a1, a2 ... this is the object identifier'
            currentDB.get().then(doc => {
                var appointment_list = doc.data();
                delete appointment_list[target_object_key]; //delete the current object from the list
                let new_appointment_list = new Object({}) //make new object since you can not delete only one element of an object
                let lengthOfAppointmentList = Object.keys(appointment_list).length;
                var i = 1
                for (val in appointment_list) {
                    new_appointment_list['a'+i] = appointment_list[val]
                    i++;
                }
                // reorganizes the list
                console.log(new_appointment_list)
                currentDB.set(new_appointment_list);
            })
            alert("Succesfully, remove appointment.")
        }
    })
}

function UpdateAppointment(id) {
    firebase.auth().onAuthStateChanged(user => { // check that a user is signed in
        if (user) {
            var uid = user.uid;
            var currentDB = db.collection("creaditcards").doc(uid)
            currentDB.get().then(doc => {
                var target_object_key = id.slice(-2); //id.slice(-2) means 'a1, a2 ... this is the object identifier'
                var appointment_list = doc.data();
                let new_appointment_list = appointment_list;

                var card_name_id = "card_name_id_" + id.slice(-2)
                var card_type_id = "card_type_id_" + id.slice(-2)
                var card_no_id = "credit_card_no_id_" + id.slice(-2)
                var cvv_no_id = "cvv_number_id_" + id.slice(-2)
                var expiry_date_id = "expiry_date_id_" + id.slice(-2)
                var billing_id = "billing_info_id_" + id.slice(-2)

                // get data to update from the page
                var card_name_value = $("#"+card_name_id).text();
                var card_type_value = $("#"+card_type_id).val();
                var card_no_value = $('#'+card_no_id).val();
                var cvv_no_value = $('#'+cvv_no_id).val();
                var expiry_date_value = $('#'+expiry_date_id).val();
                var billing_value = $('#'+billing_id).val();

                // update an object from the page
                let appointment_info_object = new Object({
                        card_type: card_type_value,
                        credit_card_no: card_no_value,
                        card_name: card_name_value,
                        expiry_date: expiry_date_value,
                        cvv_number: cvv_no_value,
                        billing_info: billing_value
                });
                console.log(appointment_info_object);
                // update the object
                new_appointment_list[target_object_key] = appointment_info_object;
                // set the list object
                currentDB.set(new_appointment_list);
            })
        }
    })
}

// shows modal when add is selected
const open = () => {
    document.querySelector(".modal").classList.remove("hidden");
}

// hides modal when "x" is selected
const close = () => {
    document.querySelector(".modal").classList.add("hidden");
    readCardList();
}

document.querySelector("#openBtn").addEventListener("click", open);
document.querySelector("#closeBtn").addEventListener("click", close);
document.querySelector(".bg").addEventListener("click", close);
