/*
    ----------------------------------------------------------------------
        Global Variables
    ----------------------------------------------------------------------        
*/
var cityFormElement     = document.querySelector("#city-form");
var cityInputElement    = document.querySelector("#idCity");
var containerWeather    = document.querySelector("#container");
var containerCities     = document.querySelector("#idCities");
var citiesButtonElement = document.querySelector("#cityButtons");

var dteToday = dayjs().format("MM/DD/YYYY");

var aryForecastIcons = [
    {"description":"clear sky", "icon":"http://openweathermap.org/img/wn/01d@2x.png"}
    , {"description":"few clouds", "icon":"http://openweathermap.org/img/wn/02d@2x.png"}
    , {"description":"scattered clouds", "icon":"http://openweathermap.org/img/wn/03d@2x.png"}
    , {"description":"broken clouds", "icon":"http://openweathermap.org/img/wn/04d@2x.png"}
    , {"description":"overcast clouds", "icon":"http://openweathermap.org/img/wn/04d@2x.png"}    
    , {"description":"shower rain", "icon":"http://openweathermap.org/img/wn/09d@2x.png"}
    , {"description":"rain", "icon":"http://openweathermap.org/img/wn/10d@2x.png"}
    , {"description":"light rain", "icon":"http://openweathermap.org/img/wn/10d@2x.png"}    
    , {"description":"moderate rain", "icon":"http://openweathermap.org/img/wn/10d@2x.png"}        
    , {"description":"thunderstorm", "icon":"http://openweathermap.org/img/wn/11d@2x.png"}
    , {"description":"rain and snow", "icon":"http://openweathermap.org/img/wn/13d@2x.png"}    
    , {"description":"snow", "icon":"http://openweathermap.org/img/wn/13d@2x.png"}
    , {"description":"mist", "icon":"http://openweathermap.org/img/wn/50d@2x.png"}
]

var aryCities = [];
// end of Global Variables

/*
    ----------------------------------------------------------------------
        The Weather API Returns Temperatures in Kelvin, this function
        converts them to Farenheit
    ----------------------------------------------------------------------
*/
var convertKelvin = function(myKelvin) {
    var myFarenheit = Math.round(((myKelvin - 273.15) * 1.8) + 32);
    return myFarenheit;
}

/*
    ----------------------------------------------------------------------
        Testing Function to Simulate Cities Being Loaded into 
        Local Storage
    ----------------------------------------------------------------------
*/
function setCities () {
    aryCities.push("Neenah", "Hyattsville", "Charlotte", "Burlington Junction", "San Antonio");
    localStorage.setItem("wdCities", aryCities);
}

/*
    ----------------------------------------------------------------------
        Load Cities from Local Storage when Page Loads

        Local Storage getItem(keyName = wdCities), wd = Weather Dashboard
    ----------------------------------------------------------------------
*/
function loadCities () {
    var lsCities = localStorage.getItem("wdCities");
    
    if (lsCities !== null) {
        aryCities = lsCities.split(",");

        for (index = 0; index < aryCities.length; index++) {
            addCity(aryCities[index]);
        };
    }
}

function addCity (myCity) {
    // add button
    var btnElement = document.createElement("button");
    btnElement.className = "btn white";
    btnElement.id = "idBtnCity"
    btnElement.setAttribute("data-weatherCity", myCity);
    btnElement.textContent = myCity;
    citiesButtonElement.appendChild(btnElement);
}

/*
    ----------------------------------------------------------------------
        Display the Current Weather for the chosen city
    ----------------------------------------------------------------------
*/
var displayDaily = function(myWeather) {
    // clear any previous city weather and forecast data from right pane
    containerWeather.innerHTML = "";

    // row
    var divContainer = document.createElement("div");
    divContainer.className = "flex-row flex-column";
    containerWeather.appendChild(divContainer);

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
    h4Element.className = "white large";    
    h4Element.textContent = myTemp + "f";
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

/*
    ----------------------------------------------------------------------
        Display the Weather Forecast for the chosen city, the Forecast
        only display the next five days even though the API call returns
        seven days.
    ----------------------------------------------------------------------
*/
var displayForecast = function(myWeather) {
    var h3Element = document.createElement("h3");
    h3Element.textContent = "5-Day Forecast:";
    containerWeather.appendChild(h3Element);
    
    // row
    var divContainer = document.createElement("div");
    divContainer.className = "flex-row justify-space-between col-sm-12";
    containerWeather.appendChild(divContainer);

    for (index = 0; index < 5; index++) {
        var myIndex = aryForecastIcons.findIndex( ({description}) => description === myWeather.daily[index].weather[0].description);    

        // div
        var divElement = document.createElement("div");
        divElement.className = "card-header2"
        divContainer.appendChild(divElement);

        // img
        if (myIndex >= 0) {
            var imgElement = document.createElement("img");
            imgElement.src = aryForecastIcons[myIndex].icon;
            divElement.appendChild(imgElement);
        }

        // h3 - Date
        h3Element = document.createElement("h3");
        h3Element.className = "white";
        h3Element.textContent = dayjs(dteToday).add((index + 1), 'd').format("MM/DD/YYYY");
        divElement.appendChild(h3Element);

        // h4 - Temperature
        myTemp = convertKelvin(myWeather.daily[index].temp.day);
        var h4Element = document.createElement("h4");
        h4Element.className = "white large";
        h4Element.textContent = myTemp + "f";
        divElement.appendChild(h4Element);

        // h6 - Wind Speed
        h6Element = document.createElement("h6");
        h6Element.className = "white";
        h6Element.textContent = "Wind: " + Math.round(myWeather.daily[index].wind_speed) + " mph | Humidity: " + myWeather.daily[index].humidity + "%";
        divElement.appendChild(h6Element);

        // h6 - Description
        h6Element = document.createElement("h6");
        h6Element.className = "white";
        h6Element.textContent = myWeather.daily[index].weather[0].description;
        divElement.appendChild(h6Element);
    }
}

/*
    ----------------------------------------------------------------------
        API Fetch to Open Weather DB
        The first fetch queries for the city
        The second fetch sends the longitude and latitude coordinates
            to the API and returns a seven (7) day forecast.
    ----------------------------------------------------------------------
*/
var getWeather = function(myCity) 
{
    var myAPIURL = "https://api.openweathermap.org/data/2.5/weather?q=" + myCity + "&APPID=4aa73af98c97ad68d159a328cfd7328a";

    fetch(myAPIURL).then(function(myResponse) 
    {
        if (myResponse.ok) 
        {
            myResponse.json().then(function(aryWeather) 
            {
                // Top Weather Box - Right Side
                displayDaily(aryWeather);

                var myLon = aryWeather.coord.lon;
                var myLat = aryWeather.coord.lat;

                myAPIURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + myLat + "&lon=" + myLon + "&appid=4aa73af98c97ad68d159a328cfd7328a";

                fetch(myAPIURL).then(function(myResponse) 
                {
                    if (myResponse.ok) {
                        myResponse.json().then(function(aryWeather) 
                        {
                            // Bottom Weather Boxes
                            // Forecast - Right Side
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

// Get Weather Button Click Handler
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);

    var myCity = cityInputElement.value.trim();

    if (myCity) {
        containerWeather.innerHTML = "";
        getWeather(myCity);
        cityInputElement.value = "";

        // Check the city array (which is the list of cities to click)
        // to see if the searched for city is not in the list.
        // If it is not in the list, add a button for the city
        // and save it to local storage.
        var myIndex = aryCities.find(city => city === myCity);
        if (myIndex === undefined) {
            addCity(myCity);
            aryCities.push(myCity);
            localStorage.setItem("wdCities", aryCities);
            
            if (citiesButtonElement === null) {
                citiesButtonElement.addEventListener("click", buttonClickHandler);
            }            
        }
    } else {
        alert("Please enter a City to get the weather for.");
    }
}

// Get Weather Button Click Listener
cityFormElement.addEventListener("submit", formSubmitHandler);

// Get City Button Click Handler
var buttonClickHandler = function(event) {
    var myCity = event.target.getAttribute("data-weatherCity");
    getWeather(myCity);
}

//setCities();
loadCities();

// Get City Button Click Listener
if (citiesButtonElement !== null) {
    citiesButtonElement.addEventListener("click", buttonClickHandler);
}