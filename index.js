async function main()
{
    let dateTarget = document.getElementsByClassName("date-value")[0]
    let timeTarget = document.getElementsByClassName("time-value")[0]
    let timezoneTarget = document.getElementsByClassName("timezone-value")[0]
    let target = document.getElementsByClassName("value")[0]
    let target2 = document.getElementsByClassName("rain")[0]
    let locationTarget = document.getElementsByClassName("city")[0]
    let hourlyRainList = document.getElementsByClassName("hourly-rain-list")[0]

    function updateCurrentDateTime()
    {
        const now = new Date();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        dateTarget.innerHTML = now.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        timeTarget.innerHTML = now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        });
        timezoneTarget.innerHTML = timeZone;
    }

    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);

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
                const next24Hours = times.slice(0, 24);

                hourlyRainList.innerHTML = next24Hours.map(function(time, index)
                {
                    const hour = new Date(time).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                    });

                    return `
                        <article class="hourly-rain-item">
                            <span class="hourly-rain-time">${hour}</span>
                            <i class="bi bi-cloud-rain hourly-rain-icon" aria-hidden="true"></i>
                            <strong>${rain[index] ?? 0}%</strong>
                        </article>
                    `;
                }).join("");

                for(let i = 0; i < next24Hours.length; i++)
                {
                    console.log(times[i], rain[i] + "%");
                }
            }
            catch(arr)
            {
                target.innerHTML = "404 Not found";
                locationTarget.innerHTML = "Location unavailable";
                hourlyRainList.innerHTML = "<p class=\"hourly-rain-status\">Hourly forecast unavailable.</p>";
            }
        },

        function(error)
        {
            console.log("Unable to get your location.");
            target.innerHTML = "Location unavailable";
            locationTarget.innerHTML = "Location unavailable";
            hourlyRainList.innerHTML = "<p class=\"hourly-rain-status\">Hourly forecast unavailable.</p>";
        }
    );
}

main();