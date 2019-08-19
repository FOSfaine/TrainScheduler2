$(document).ready(function (window) {
    moment().format();

    var firebaseConfig = {
        apiKey: "AIzaSyAvUzg15aSPlb8D17e8lB7ecAfHlZkIQnk",
        authDomain: "trainscheduler-1dac8.firebaseapp.com",
        databaseURL: "https://trainscheduler-1dac8.firebaseio.com",
        projectId: "trainscheduler-1dac8",
        storageBucket: "",
        messagingSenderId: "798328649505",
        appId: "1:798328649505:web:55d81e839dcce023"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    // 2. Submit button for adding trains
    $("#submit-btn").on("click", function (event) {
        event.preventDefault();

        // Grabs user input
        var trainName = $("#train-name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        //converts firstTrain time to Unix
        var firstTrain = moment($("#start-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
        // var frequency = moment($("#frequency-input").val().trim(), "HH:mm").format("X");
        var frequency = $("#frequency-input").val().trim();
        // var frequency = moment($("#frequency-input").val().trim(), "HH:mm").format("X");

        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: destination,
            start: firstTrain,
            frequency: frequency
        };

        // Uploads train data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.start);
        console.log(newTrain.frequency);

        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#start-input").val("");
        $("#frequency-input").val("");
    });

    // 3. Creates Firebase event for adding trains to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        // Stores everything into variables
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var firstTrain = childSnapshot.val().start;

        var firstTrainFormatted = moment(firstTrain, "X").format("hh:mm");
        console.log("first train: " + firstTrain);
        console.log("first Train (formatted): " + firstTrainFormatted);

        // // Current Time
        var currentTime = moment();
        console.log("current Time: " + currentTime);

        var formattedCurrentTime = moment(currentTime).format("hh:mm");
        console.log("current time (formatted): " + formattedCurrentTime);

        // Difference between first train (in Unix) and current time (in Unix):
        var trainDiff = moment().subtract(firstTrain, "X").format("X");
        console.log("current time - first train time (Unix): " + trainDiff);

        // Difference between first train and current time (in minutes):
        var timeDiffInMinutes = Math.ceil((trainDiff / 60000) / 60);
        console.log("time difference in minutes: " + timeDiffInMinutes);

        // Difference between first train and current time (in hours):
        var timeDiffInHours = Math.ceil(((trainDiff / 60000) / 60) / 60);
        console.log("time difference in hours: " + timeDiffInHours);

        console.log("train frequency: " + frequency);

        //Remainder, after dividing trainDifference with frequency is Minutes Away
        var remainder = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
        var minutesAway = frequency - remainder;
        console.log("minutes away: " + minutesAway);

        // var minutesAwayNumbers = 435 % 60;
        // console.log("minutes away in numbers: " + minutesAwayNumbers);
        //Next train arrival time:
        // var nextArrival = moment().add(minutesAwayNumbers, "m").format("hh:mm");
        // console.log("next arrival: " + nextArrival);

        //Next train arrival time:
        var nextArrival = moment().add(minutesAway, "m").format("hh:mm A");
        console.log("next arrival: " + nextArrival);

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minutesAway)
        );

        // Append the new row to the table
        $("#train-table > tbody").append(newRow);
    });

});