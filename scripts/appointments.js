        function UpdateAppointment(id) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    var uid = user.uid;
                    // check user signen in.
                    var currentDB = db.collection("appointment_dictionary").doc(uid)
                    currentDB.get().then(doc => {
                        var target_object_key = id.slice(-2);   //id.slice(-2) means get 'a1, a2 ... this is appointment identifier in screen'
                        var appointment_list = doc.data();
                        let new_appointment_list = appointment_list;

                        var date_id = "date_id_" + id.slice(-2)
                        var to_time_id = "to_time_id_" + id.slice(-2)
                        var from_time_id = "from_time_id_" + id.slice(-2)
                        var gym_name_id = "gym_name_id_" + id.slice(-2)

                        var date_value = $("#" + date_id).val();                //get data to update from the page
                        var to_time_value = $("#" + to_time_id).val();
                        var from_time_value = $("#" + from_time_id).val();
                        var gym_name_id_value = $("#" + gym_name_id).text();

                        let appointment_info_object = new Object({              //make object to update from the page
                            date: date_value,
                            start_time: from_time_value,
                            end_time: to_time_value,
                            gym_name: gym_name_id_value
                        });

                        new_appointment_list[target_object_key] = appointment_info_object; //update object
                        currentDB.set(new_appointment_list);    //set appointment list object
                    })
                }
            })
        }

        function removeAppointment(id) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    var uid = user.uid
                    var currentDB = db.collection("appointment_dictionary").doc(uid)
                    var target_object_key = id.slice(-2);   //id.slice(-2) means 'a1, a2 ... this is appointment identifier in screen'
                    currentDB.get().then(doc => {
                        var appointment_list = doc.data();
                        delete appointment_list[target_object_key]; // delete current object from the appointment_list 
                        let new_appointment_list = new Object({})   // make new appointment object since there are no way to delete only one element of appointment objects
                        let lengthOfAppointmentList = Object.keys(appointment_list).length;
                        var i = 1
                        for (val in appointment_list) {
                            new_appointment_list['a' + i] = appointment_list[val]
                            i++;
                        }                                           // re organize appointment object list.
                        console.log(new_appointment_list)
                        currentDB.set(new_appointment_list).then (
                            readAppointmentList()
                        );
                    })
                }
            })
            alert("Succesfully, remove appointment.")
        }

        function addAppointment() {
            firebase.auth().onAuthStateChanged(user => { // check user signen in
                if (user) {
                    var uid = user.uid // get user.uid
                    var currentDB = db.collection("appointment_dictionary").doc(uid) //get collection (appointment lists)
                    currentDB.get().then(doc => {
                        if (doc.exists) {
                            var appointment_list = doc.data();

                            let lengthOfAppointmentList = Object.keys(appointment_list).length + 1; 
                            let gymname = document.getElementById("id_gymname").value;              //assign appointment data from input tag.
                            let from_time = document.getElementById("id_from_time").value;          //assign appointment data from input tag.
                            let to_time = document.getElementById("id_to_time").value;              //assign appointment data from input tag.
                            let date = document.getElementById("id_date").value;                    //assign appointment data from input tag.
                            let pointer = 'a' + lengthOfAppointmentList                             //a + diciaml is unique id of an appointment. 
                            let new_appointment_list = appointment_list;
                            let new_appointment_info = new Object({                                 //get origin appointment list from firebase
                                date: date,
                                start_time: from_time,
                                end_time: to_time,
                                gym_name: gymname
                            });
                            new_appointment_list[pointer] = new_appointment_info;                   //Add new appointment object to origin appointment_list
                            currentDB.set(new_appointment_list);                                    //Set new appointment list
                        } else {                                                                    //In case that there are no appointment or user is new user.
                            let gymname = document.getElementById("id_gymname").value;
                            let from_time = document.getElementById("id_from_time").value;
                            let to_time = document.getElementById("id_to_time").value;
                            let date = document.getElementById("id_date").value;
                            let new_appointment_info = new Object({
                                'a1': {
                                    date: date,
                                    start_time: from_time,
                                    end_time: to_time,
                                    gym_name: gymname
                                }
                            });
                            currentDB.set(new_appointment_info);
                        }
                    })

                } else {
                    alert("no user sign-in");
                }
            })
            alert("Succesfully, Add the appointment.");
        }

        function readAppointmentList() { // Print out appointments user have on the screen
            $(".appointment_container").empty();
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    var uid = user.uid
                    var currentDB = db.collection("appointment_dictionary").doc(uid)
                    currentDB.get().then(doc => {
                        if (doc.exists) {
                            var appointment_list = doc.data();
                            const key_list = Object.keys(appointment_list);
                            let lengthOfAppointmentList = Object.keys(appointment_list).length; // Get how many appointment the user  have from the database.
                            
                            for (var i = lengthOfAppointmentList; i > 0; i--) { // Append in reverse order to show the lastest apppointment first.
                                pointer = 'a' + i;
                                date = appointment_list[pointer]['date'];
                                end_time = appointment_list[pointer]["end_time"];
                                start_time = appointment_list[pointer]["start_time"];
                                gym_name = appointment_list[pointer]["gym_name"];
                                var containerform = // ${pointer} will be used as identifier for appointment objects in firebase
                                    `<div class="card text-white bg-secondary mb-5" id="${pointer}" style="max-width: 18rem;">
                                        <div class="card-header" id="gym_name_id_${pointer}">${gym_name}</div>
                                            <div class="card-body">
                                                <h5 class="card-title">Date:</h5>
                                                <input type="date" id="date_id_${pointer}" value="${date}">
                                                <p class="card-text">Start time: <input type="time" id="from_time_id_${pointer}" value="${start_time}"></p>
                                                <p class="card-text">Start time: <input type="time" id="to_time_id_${pointer}" value="${end_time}"></p>
                                                <button id="deleteButton_${pointer}" class="btn btn-secondary" onclick="removeAppointment(this.id)">Remove</button>
                                                <button id="deleteButton_${pointer}" class="btn btn-secondary" onclick="UpdateAppointment(this.id)">Update</button>
                                            </div>
                                    </div>`;
                                $(".appointment_container").append(containerform);
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
        readAppointmentList();

        const open = () => {    // Shows modal to add.
            document.querySelector(".modal").classList.remove("hidden");
        }
        const close = () => {   // Hides modal to add.
            document.querySelector(".modal").classList.add("hidden");
            readAppointmentList();
        }
        document.querySelector("#openBtn").addEventListener("click", open);
        document.querySelector("#closeBtn").addEventListener("click", close);
        document.querySelector(".bg").addEventListener("click", close);