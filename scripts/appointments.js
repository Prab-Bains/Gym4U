        function UpdateAppointment(id) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    var uid = user.uid;
                    var currentDB = db.collection("appointment_dictionary").doc(uid)
                    currentDB.get().then(doc => {
                        var target_object_key = id.slice(-2);
                        var appointment_list = doc.data();
                        let new_appointment_list = appointment_list;

                        var date_id = "date_id_" + id.slice(-2)
                        var to_time_id = "to_time_id_" + id.slice(-2)
                        var from_time_id = "from_time_id_" + id.slice(-2)
                        var gym_name_id = "gym_name_id_" + id.slice(-2)

                        var date_value = $("#" + date_id).val();
                        var to_time_value = $("#" + to_time_id).val();
                        var from_time_value = $("#" + from_time_id).val();
                        var gym_name_id_value = $("#" + gym_name_id).text();

                        let appointment_info_object = new Object({
                            date: date_value,
                            start_time: from_time_value,
                            end_time: to_time_value,
                            gym_name: gym_name_id_value
                        });

                        new_appointment_list[target_object_key] = appointment_info_object;
                        currentDB.set(new_appointment_list);
                    })
                }
            })
        }

        function removeAppointment(id) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    var uid = user.uid
                    var currentDB = db.collection("appointment_dictionary").doc(uid)
                    var target_object_key = id.slice(-2);
                    currentDB.get().then(doc => {
                        var appointment_list = doc.data();
                        delete appointment_list[target_object_key];
                        let new_appointment_list = new Object({})
                        let lengthOfAppointmentList = Object.keys(appointment_list).length;
                        var i = 1
                        for (val in appointment_list) {
                            new_appointment_list['a' + i] = appointment_list[val]
                            i++;
                        }
                        console.log(new_appointment_list)
                        currentDB.set(new_appointment_list);
                    })
                    alert("Succesfully, remove appointment.")
                }
            })
        }

        function addAppointment() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    var uid = user.uid
                    var currentDB = db.collection("appointment_dictionary").doc(uid)
                    currentDB.get().then(doc => {
                        if (doc.exists) {
                            var appointment_list = doc.data();
                            let lengthOfAppointmentList = Object.keys(appointment_list).length + 1;
                            let gymname = document.getElementById("id_gymname").value;
                            let from_time = document.getElementById("id_from_time").value;
                            let to_time = document.getElementById("id_to_time").value;
                            let date = document.getElementById("id_date").value;
                            let pointer = 'a' + lengthOfAppointmentList
                            let new_appointment_list = appointment_list;
                            let new_appointment_info = new Object({
                                date: date,
                                start_time: from_time,
                                end_time: to_time,
                                gym_name: gymname
                            });
                            new_appointment_list[pointer] = new_appointment_info;
                            currentDB.set(new_appointment_list);
                        } else {
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
        }

        function readAppointmentList() {
            $(".appointment_container").empty();
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    var uid = user.uid
                    var currentDB = db.collection("appointment_dictionary").doc(uid)
                    currentDB.get().then(doc => {
                        if (doc.exists) {
                            var appointment_list = doc.data();
                            const key_list = Object.keys(appointment_list);
                            let lengthOfAppointmentList = Object.keys(appointment_list).length;

                            for (var i = lengthOfAppointmentList; i > 0; i--) {
                                pointer = 'a' + i;
                                date = appointment_list[pointer]['date'];
                                end_time = appointment_list[pointer]["end_time"];
                                start_time = appointment_list[pointer]["start_time"];
                                gym_name = appointment_list[pointer]["gym_name"];
                                var containerform =
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
