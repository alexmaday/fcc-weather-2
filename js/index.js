window.onload = function() {
    var lat, lon;
    var city, country;
    var units = "imperial";
    var data;
    var ipinfo;

    (function getLocation() {
        var http = new XMLHttpRequest();
        http.onreadystatechange = function() {
            if (http.readyState === XMLHttpRequest.DONE) {
                if (http.status === 200) {
                    ipinfo = JSON.parse(http.responseText);
                    // gotLocation();
                    gotCity();
                } else {
                    console.log("Something else happened: 404 or 500");
                    console.log("HTTP Status: " + http.status);
                }
            }
        }
        http.open("GET", "https://ipinfo.io/json");
        http.send();
    }());

    function gotCity() {
        city = ipinfo["city"];
        country = ipinfo["country"];
        getWeatherData();
    }

    /*function gotLocation() {
        var coordinates = ipinfo.loc.split(',');
        // if (ipinfo.country != "US") units = "metric";
        lat = coordinates[0];
        lon = coordinates[1];
        getWeatherData();
    }*/

    function getWeatherData() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("weather object data before parse: " + xhr.responseText);
                    data = JSON.parse(xhr.responseText);
                    console.log("parsed data: " + data);
                    // put it on the page
                    console.log(data);
                    updatePageData();
                } else {
                    console.log("Something else happened: 404 or 500");
                    console.log("HTTP Status: " + http.status);
                }
            }
        };

        var endpoint = "http://api.openweathermap.org/data/2.5/weather?&appid=c28cb26ddedc5488a85c4525c702c2b4";
        // var url = endpoint + "&lat=" + lat + "&lon=" + lon + "&units=" + units;
        var url = endpoint + "&q=" + city + "," + country + "&units=" + units;
        xhr.open("GET", url);
        xhr.send();
    }

    function updatePageData() {
        var temp = Math.floor(data.main.temp);
        document.getElementById('temperature').innerHTML = temp;
        // updateBackground(temp);
        document.getElementById('units').innerHTML = getCurrentUnits();
        var iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        document.getElementById("icon").setAttribute("src", iconUrl);

        // setup the greeting
        var date = new Date();
        var timeOfDay = date.getHours();

        var greeting;
        if (timeOfDay < 12) {
            greeting = "Good Morning";
        } else if (timeOfDay < 18) {
            greeting = "Good Afternoon";
        } else {
            greeting = "Good Evening";
        }
        document.getElementById("time-of-day").innerHTML = greeting;
        document.getElementById("city").innerHTML = city + " is ";
        registerUnitsChange();
    }

    function getCurrentUnits() {
        if (units == "imperial") return 'F';
        else return 'C';
    }

    function registerUnitsChange() {
        elUnits = document.getElementById('units');
        elUnits.addEventListener("click", function() {
            if (units == "imperial") {
                var F = data.main.temp;
                var C = (F - 32) / (9 / 5);
                document.getElementById('temperature').innerHTML = Math.floor(C);
                units = "celsius";
                elUnits.innerHTML = "C";
            } else {
                document.getElementById('temperature').innerHTML = Math.floor(data.main.temp);
                units = "imperial";
                elUnits.innerHTML = "F";
            }

        });
    }

};