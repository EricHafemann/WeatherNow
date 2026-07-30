import tzlookup from 'https://esm.sh/tz-lookup';

const inputCity = document.getElementById('cidade');
const erro = document.getElementById('erro');

async function bucarCidade (evento) {
    
    evento.preventDefault();

    const city = inputCity.value    

        erro.innerHTML = ""; 

        const responseLocal = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`)

        const dataResponse = await responseLocal.json();

        if(!dataResponse.results || dataResponse.results.lenght === 0)
        {
            erro.innerHTML = "<p> Cidade não encontrada </p>";
            return;
        }

        else
        {
             let latitude = dataResponse.results[0].latitude;
            let longitude = dataResponse.results[0].longitude;


            const responseTempo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`)

            const dataTempo = await responseTempo.json();

            atualizarHtml(dataTempo.current, latitude, longitude);

            buscarClima (latitude, longitude)
        }

}

async function buscarClima (latitude, longitude)
{
    try
    {

    console.log(latitude)
    console.log(longitude)

    const responseTempo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`)

    const dataTempo = await responseTempo.json()

    atualizarHtml(dataTempo.current, latitude, longitude);

    }catch(error)
    {
        console.error(error);
        erro.innerHTML = "<p>Ocorreu um erro ao procurar o clima</p>";
    }
}

function atualizarHtml (objetoTempo, latitude, longitude)
{

    document.getElementById('city-name').textContent = inputCity.value;

    const temperature = objetoTempo.temperature_2m;
    document.getElementById('temperature').textContent = temperature;

    const fellsLike = objetoTempo.apparent_temperature;
    document.getElementById('feels-like').textContent = fellsLike + "°C";

    const humidity = objetoTempo.relative_humidity_2m;
    document.getElementById('humidity').textContent = humidity + "%";

    const wind = objetoTempo.wind_speed_10m;
    document.getElementById('wind').textContent = wind + "km/h";

   
    const date = obterHoraEMinuto(latitude, longitude)
    document.getElementById('time').textContent = date;

}

function obterHoraEMinuto (latitude, longitude)
{
    try
    {

    const fusoHorario = tzlookup(latitude, longitude);

    const formato = new Intl.DateTimeFormat("pt-BR", {
        timeZone: fusoHorario,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    return formato.format(new Date());
    }catch(erro)
    {
        console.log("Coordenadas Inválidas")
        return null;
    }
}

const form = document.getElementById('weather-form');
form.addEventListener('submit', bucarCidade)