$(document).ready(function () {

    let city = $("#searchTerm").val();

    const APIKey = "&appid=9253d72026dcb5bd377bcc78b9496941";

    let date = new Date();
    

    $("#searchTerm").keypress(function(event) {
        if (event.keyCode === 13) {
                event.preventDefault();
                $("#searchBtn").click();
                
        }
    });

    $('#searchBtn, #clickable').on("click", function() {

        $('#forecast').addClass('show');
        $('#weather-icon').empty();
      

        city = $("#searchTerm").val();
        
        $("#searchTerm").val("");

    const queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" + city + APIKey;

    $.ajax({
            url: queryURL,
            method: "GET"
        })

        .then(function (response) {

            const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

            $("#city").html("<h3>" + response.name + " Weather Details</h3>");
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");
            const icon = $("#weather-icon");
            icon.append(image)

            console.log(response)

            console.log("City: " + response.name)
            console.log("Weather: " + response.weather[0].icon)

            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
            console.log("Temp: " + Math.floor(tempF))

            $("#temperature").text("Temperature: " + Math.floor(tempF) + " °F");

            console.log("Humidity: " + response.main.humidity)

            console.log("Wind Speed: " + response.wind.speed)

            getCurrentForecast(response);

            let lat = response.coord.lat;
            let lon = response.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon  + APIKey + "&cnt=1";
            $.ajax({
                url: UVQueryURL,
                method: "GET"
            })
            .then(function(response){
                let UVIndex = document.createElement("span");
                UVIndex.setAttribute("class","badge badge-danger");
                UVIndex.innerHTML = response.data[0].value;
                $("#UV-index").innerHTML = "UV Index: ";
                $("#UV-index").append(UVIndex);
        });

            console.log(UVQueryURL);
            console.log(response);
        });

});

function getCurrentForecast ()  {

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + APIKey,
        method: "GET"
    }).then(function (response){
        console.log(response)
        console.log(response.dt)
        $('#dayForecast').empty();

        let results = response.list;
        console.log(results)

        //I borrowed this section of code to retreive the 5 day forecast from github.com/joelyn

        for (let i = 0; i < results.length; i++) {

            let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
            let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
            console.log(day);
            console.log(hour);
      
            if(results[i].dt_txt.indexOf("12:00:00") !== -1){
              
              // Temparature
              let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
              let tempF = Math.floor(temp);
      
              const card = $("<div>").addClass("card col s2 m2 white-text");
              const cardBody = $("<div>").addClass("card-panel blue forecastBody")
              const cityDate = $("<h3>").addClass("card-title").text(date[0]);
              const temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
              const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
      
              const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
      
              cardBody.append(cityDate, image, temperature, humidity);
              card.append(cardBody);
              $("#dayForecast").append(card);
      
            }
          }
    })
}

});
