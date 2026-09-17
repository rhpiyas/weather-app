async function main()
{
    let dateTarget = document.getElementsByClassName("date-value")[0]
    let timeTarget = document.getElementsByClassName("time-value")[0]
    let timezoneTarget = document.getElementsByClassName("timezone-value")[0]
    let target = document.getElementsByClassName("value")[0]
    let target2 = document.getElementsByClassName("rain")[0]
    let locationTarget = document.getElementsByClassName("city")[0]
    let hourlyRainList = document.getElementsByClassName("hourly-rain-list")[0]
    let hourlyRainTitle = document.getElementById("hourly-rain-title")
    let rainProbabilityTarget = document.getElementsByClassName("rain-probability")[0]
    let adviceTarget = document.getElementsByClassName("advice-message")[0]
    let title = document.getElementsByTagName("title")[0]

    function getRainAdvice(probability)
    {
        if(probability < 20)
        {
            return "☀️ বৃষ্টির সম্ভাবনা এত কম যে ছাতা নিলে ছাতাই আপনাকে নিয়ে হাসবে";
        }

        if(probability < 40)
        {
            return "🌥️ আকাশ একটু ভাব নিচ্ছে; ছাতা নিলে নিরাপদ, না নিলে সাহসের পরীক্ষা";
        }

        if(probability < 60)
        {
            return "🌂 ছাতা সঙ্গে রাখুন; ভিজে গেলে চুলের সাজসজ্জা নিজেই নতুন নকশা নেবে";
        }

        if(probability < 80)
        {
            return "🌧️ ছাতা ছাড়া বের হলে ভিজে ফিরে এসে আবহাওয়াকে দোষ দিয়ে লাভ হবে না";
        }

        if(probability < 95)
        {
            return "⛈️ বৃষ্টি নামার মহড়া চলছে; ছাতা ছাড়া বের হলে আপনিই হবেন ভেজা খবর";
        }

        return "🌊 বৃষ্টি প্রায় নিশ্চিত; ছাতা নিন, না হলে রাস্তার মাছ আপনাকে আত্মীয় ভাবতে পারে";
    }

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

                const locationName =
                    locationData.address.city ||
                    locationData.address.town ||
                    locationData.address.village ||
                    locationData.address.state ||
                    "your location";

                locationTarget.innerHTML = locationName;
                hourlyRainTitle.innerHTML = `Rain in the next 24 hours in ${locationName}`;
                title.innerHTML = "Amar Weather - " + locationName


                // Rain Probability
                const times = data.hourly.time;
                const rain = data.hourly.precipitation_probability;
                const nextHourIndex = times.findIndex(function(time)
                {
                    return time > data.current.time;
                });
                const currentHourIndex = nextHourIndex === -1
                    ? times.length - 1
                    : Math.max(0, nextHourIndex - 1);
                const forecastStartIndex = Math.max(0, currentHourIndex - 1);
                const currentTileIndex = currentHourIndex - forecastStartIndex;
                const next24Hours = times.slice(forecastStartIndex, forecastStartIndex + 24);
                const currentRainProbability = rain[currentHourIndex] ?? 0;

                rainProbabilityTarget.innerHTML = `বর্তমান বৃষ্টির সম্ভাবনা: ${currentRainProbability}%`;
                adviceTarget.innerHTML = getRainAdvice(currentRainProbability);

                hourlyRainList.innerHTML = next24Hours.map(function(time, index)
                {
                    const hourlyIndex = forecastStartIndex + index;
                    const hour = new Date(time).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                    });
                    const currentClass = index === currentTileIndex ? " hourly-rain-current" : "";

                    return `
                        <article class="hourly-rain-item${currentClass}">
                            <span class="hourly-rain-time">${hour}</span>
                            <i class="bi bi-cloud-rain hourly-rain-icon" aria-hidden="true"></i>
                            <strong>${rain[hourlyIndex] ?? 0}%</strong>
                        </article>
                    `;
                }).join("");

                for(let i = 0; i < next24Hours.length; i++)
                {
                    const hourlyIndex = forecastStartIndex + i;
                    console.log(times[hourlyIndex], rain[hourlyIndex] + "%");
                }
            }
            catch(arr)
            {
                target.innerHTML = "404 Not found";
                locationTarget.innerHTML = "Location unavailable";
                rainProbabilityTarget.innerHTML = "বর্তমান বৃষ্টির সম্ভাবনা পাওয়া যায়নি";
                adviceTarget.innerHTML = "আবহাওয়ার তথ্য পাওয়া যাচ্ছে না";
                hourlyRainList.innerHTML = "<p class=\"hourly-rain-status\">Hourly forecast unavailable.</p>";
            }
        },

        function(error)
        {
            console.log("Unable to get your location.");
            target.innerHTML = "Location unavailable";
            locationTarget.innerHTML = "Location unavailable";
            rainProbabilityTarget.innerHTML = "বর্তমান বৃষ্টির সম্ভাবনা পাওয়া যায়নি";
            adviceTarget.innerHTML = "আবহাওয়ার তথ্য পাওয়া যাচ্ছে না";
            hourlyRainList.innerHTML = "<p class=\"hourly-rain-status\">Hourly forecast unavailable.</p>";
        }
    );
}

main();