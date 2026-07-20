async function main()
{
    let target = document.getElementsByClassName("value")[0]
    let target2 = document.getElementsByClassName("rain")[0]


    try
    {
        const raw = await fetch("https://api.open-meteo.com/v1/forecast?latitude=23.8486&longitude=90.25&current=temperature_2m,wind_speed_10m&timezone=auto");

        console.log(raw.status);
        console.log(raw.statusText);

        if(!raw.ok)
        {
            throw new Error;
        }

        const data = await raw.json();
        target.innerHTML = data.current.temperature_2m + " °C";
    }
    catch(arr)
    {
        target.innerHTML = "404 Not found";
    }
}

main();