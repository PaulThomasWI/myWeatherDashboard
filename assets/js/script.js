var cityFormElement  = document.querySelector("#city-form");
var cityInputElement = document.querySelector("#idCity");

var containerContent = document.querySelector("#container");

var dteToday = dayjs().format("MM/DD/YYYY");

var convertKelvin = function(myKelvin) {
    var myFarenheit = Math.round(((myKelvin - 273.15) * 1.8) + 32);
    return myFarenheit;
}

var displayDaily = function(myWeather) {
    // row
    var divContainer = document.createElement("div");
    divContainer.className = "flex-row flex-column";
    containerContent.appendChild(divContainer);

    // div
    var divElement = document.createElement("div");
    divElement.className = "card-header2"
    divContainer.appendChild(divElement);
    
    // h2 - City - Date
    var h2Element = document.createElement("h2");
    h2Element.className = "white";
    h2Element.textContent = "Today's Weather in " + myWeather.name;
    divElement.appendChild(h2Element);

    // h4 - Temperature
    myTemp = convertKelvin(myWeather.main.temp);
    myHigh = convertKelvin(myWeather.main.temp_max);
    myLow  = convertKelvin(myWeather.main.temp_min);

    var h4Element = document.createElement("h4");
    h4Element.className = "white";    
    h4Element.textContent = "Current Temp: " + myTemp + " F";
    divElement.appendChild(h4Element);

    // h6 - Wind Speed | Humidity
    var mySunrise = dayjs.unix(myWeather.sys.sunrise).format("hh:mm A");
    var mySunset  = dayjs.unix(myWeather.sys.sunset).format("hh:mm A");

    h6Element = document.createElement("h6");
    h6Element.className = "white";    
    h6Element.textContent = "Wind: " + Math.round(myWeather.wind.speed) + " mph" + " | Humidity: " 
        + myWeather.main.humidity + "% | Sunrise: " + mySunrise + " | Sunset: " + mySunset
        + " | Low: " + myLow + " | High: " + myHigh
        ;
    divElement.appendChild(h6Element);
}

var displayForecast = function(myWeather) {
    var h3Element = document.createElement("h3");
    h3Element.textContent = "5-Day Forecast:";
    containerContent.appendChild(h3Element);
    
    // row
    var divContainer = document.createElement("div");
    divContainer.className = "flex-row justify-space-between col-sm-12";
    containerContent.appendChild(divContainer);

    for (index = 0; index < 5; index++) {
        // div
        var divElement = document.createElement("div");
        divElement.className = "card"
        divContainer.appendChild(divElement);

        h3Element = document.createElement("h3");
        h3Element.textContent = dayjs(dteToday).add((index + 1), 'd').format("MM/DD/YYYY");
        divElement.appendChild(h3Element);

        // h4 - Temperature
        myTemp = convertKelvin(myWeather.daily[index].temp.day);
        var h4Element = document.createElement("h4");
        h4Element.textContent = "Temp: " + myTemp + " F";
        divElement.appendChild(h4Element);

        // h6 - Wind Speed
        h6Element = document.createElement("h6");
        h6Element.textContent = "Wind: " + Math.round(myWeather.daily[index].wind_speed) + " mph";
        divElement.appendChild(h6Element);

        // h6 - Humidity
        h6Element = document.createElement("h6");
        h6Element.textContent = "Humidity: " + myWeather.daily[index].humidity + "%";
        divElement.appendChild(h6Element);
    }
}

var getWeather = function(myCity) 
{
    var myAPIURL = "https://api.openweathermap.org/data/2.5/weather?q=" + myCity + "&APPID=4aa73af98c97ad68d159a328cfd7328a";

    fetch(myAPIURL).then(function(myResponse) 
    {
        if (myResponse.ok) 
        {
            myResponse.json().then(function(aryWeather) 
            {
                displayDaily(aryWeather);

                var myLon = aryWeather.coord.lon;
                var myLat = aryWeather.coord.lat;

                myAPIURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + myLat + "&lon=" + myLon + "&appid=4aa73af98c97ad68d159a328cfd7328a";

                fetch(myAPIURL).then(function(myResponse) 
                {
                    if (myResponse.ok) {
                        myResponse.json().then(function(aryWeather) 
                        {
                            displayForecast(aryWeather);
                        });
                    } else {
                        alert("Error: Details for city not found.");
                    }
                });
            })
        } 
        else 
        {
            alert("Error: City Not Found.");
        }
    });
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);

    var myCity = cityInputElement.value.trim();

    if (myCity) {
        containerContent.innerHTML = "";
        getWeather(myCity);
        cityInputElement.value = "";
    } else {
        alert("Please enter a City to get the weather for.");
    }
}

cityFormElement.addEventListener("submit", formSubmitHandler);