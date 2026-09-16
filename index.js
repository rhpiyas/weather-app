async function main()
{
    let target = document.getElementsByClassName("value")[0]
    let target2 = document.getElementsByClassName("rain")[0]
    let locationTarget = document.getElementsByClassName("city")[0]

    navigator.geolocation.getCurrentPosition(
        async function(position)
        {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            try
            {
                // Weather API
                const raw = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=precipitation_probability&timezone=auto`
                );

                console.log(raw.status);
                console.log(raw.statusText);

                if(!raw.ok)
                {
                    throw new Error;
                }

                const data = await raw.json();
                console.log(data);

                // Temperature
                target.innerHTML = data.current.temperature_2m + " °C";


                // Location Name
                const locationRaw = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );

                const locationData = await locationRaw.json();

                console.log(locationData);

                locationTarget.innerHTML =
                    locationData.address.city ||
                    locationData.address.town ||
                    locationData.address.village ||
                    locationData.address.state;


                // Rain Probability
                const times = data.hourly.time;
                const rain = data.hourly.precipitation_probability;

                for(let i = 0; i < times.length; i++)
                {
                    console.log(times[i], rain[i] + "%");
                }
            }
            catch(arr)
            {
                target.innerHTML = "404 Not found";
                locationTarget.innerHTML = "Location unavailable";
            }
        },

        function(error)
        {
            console.log("Unable to get your location.");
            target.innerHTML = "Location unavailable";
            locationTarget.innerHTML = "Location unavailable";
        }
    );
}

main();