var config = {
    apiKey: "AIzaSyBbQKGTZGvntku0aeXjVO7841RM2v_0cu0",
    authDomain: "train-schedule-e0254.firebaseapp.com",
    databaseURL: "https://train-schedule-e0254.firebaseio.com",
    projectId: "train-schedule-e0254",
    storageBucket: "",
    messagingSenderId: "678762029974"
};
  
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function(){

    $("#submit-button").on("click", function(event) {
        event.preventDefault();

        var trainName = $("#train-name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTrainTime = $("#first-train-input").val();
        var frequency = $("#frequency-input").val().trim();

        var newTrain = {
            name: trainName,
            place: destination,
            initialTime: firstTrainTime,
            frequencyMin: frequency
        };

        database.ref().push(newTrain);

        console.log ("user-inputs")
        console.log(newTrain.name);
        console.log(newTrain.place);
        console.log(newTrain.initialTime);
        console.log(newTrain.frequencyMin);

        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");

    });

    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        // console.log(childSnapshot.val());
        
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().place;
        var trainInitialTime = childSnapshot.val().initialTime;
        var trainFrequency = childSnapshot.val().frequencyMin;
        
        // Train Info
        console.log("continued...")
        console.log("train name: " + trainName);
        console.log("train destination: "  + trainDestination);
        console.log("train initial time: " + trainInitialTime);
        console.log("train frequency: " + trainFrequency);

        
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        if(moment(currentTime).isBefore((moment(trainInitialTime)),"hours")){

            console.log ("STATUS: waiting for first train of the day");
        
            var nextTrainTime = moment(trainInitialTime).format("hh:mm a");

            var minutesUntilTrain = currentTime.diff(nextTrainTime);

            var newRow = $("<tr>");
            newRow.append($("<td>"+ trainName + "</td><td>"+ trainDestination + "</td><td>"+ trainFrequency+ "</td><td>"+ nextTrainTime+ "</td><td>" + minutesUntilTrain+ "</td>"));
            $("tbody").prepend(newRow)
            
            console.log("________________________")
        
        }
        
        else {
            console.log ("STATUS: normal scenario");
            
            // var firstTimeConverted = moment(trainInitialTime, "HH:mm").subtract(1, "years");
            // console.log(firstTimeConverted);

        // var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        
            var diffTime = moment().diff(moment(trainInitialTime), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            var remainder = diffTime % trainFrequency;
            console.log("Time remainder: " + remainder);

            var minutesUntilTrain = trainFrequency - remainder;
            console.log("Minutes Until Next Train: " + minutesUntilTrain);

            var nextTrain = moment().add(minutesUntilTrain, "minutes");
            console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));
            console.log("________________________")

            var nextTrainTime = moment(nextTrain).format("hh:mm a");
            
            var newRow = $("<tr>");
            newRow.append($("<td>"+ trainName + "</td><td>"+ trainDestination + "</td><td>"+ trainFrequency+ "</td><td>"+ nextTrainTime+ "</td><td>" + minutesUntilTrain+ "</td>"));
            $("tbody").prepend(newRow);

        }
    });
});