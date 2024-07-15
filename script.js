//API_KEY
const API_KEY='c1a531491b49ba1c99b0128388028bde'

//city
let currCity='Tirunelveli'
let units='metric'

//Selectors
let city=document.querySelector(".weather_city")
let search =document.querySelector(".weather_search")
let suggest_box=document.querySelector(".suggest_box")
let timeEl=document.getElementById("time")
let dateEl=document.getElementById("date")
let weather_forecast=document.querySelector(".weather_forecast")
let weather_temp=document.querySelector(".weather_temp")
let weather_icon=document.querySelector(".weather_icon")
let weather_minmax=document.querySelector(".weather_minmax")
let weather_feelslike=document.querySelector(".weather_feelslike")
let weather_humidity=document.querySelector(".weather_humidity")
let weather_wind=document.querySelector(".weather_wind")
let weather_pressure=document.querySelector(".weather_pressure")


//Searching City Suggestions
suggest_box.style.display='none'

async function showSuggestions(value){

    const suggestions = document.getElementById("suggestions")
    suggestions.innerHTML = ''
    suggest_box.style.display='block'

    if(value.length > 0){
        try{
            const response= await fetch(`https://api.openweathermap.org/data/2.5/find?q=${value}&type=like&sort=population&cnt=30&appid=${API_KEY}`)
            const data = await response.json();
            const cities = data.list;

            cities.forEach(city => {
                const li = document.createElement('li');
                li.textContent = `${city.name}, ${convertCountryCode(city.sys.country)}`;
                li.onclick = () => {
                    currCity= city.name;
                    getWeather()
                    search.value=''
                    suggestions.innerHTML = ''
                    suggest_box.style.display='none'
                };
                suggestions.appendChild(li);
            })
        }
        catch(error){
            console.log(error)
        }
    }
   
}

//Searching city
document.querySelector(".weather_searchform").addEventListener('submit',e=>{
    e.preventDefault()
    currCity=search.value 
    getWeather()
    search.value=''
    suggestions.innerHTML = ''
    suggest_box.style.display='none'
})


//Convering Units
document.addEventListener("DOMContentLoaded",function(){
    const check=document.getElementById("check")
    check.addEventListener("change",function(){
        if(this.checked){
            units="imperial"
            getWeather()
        }
        else{
            units="metric"
            getWeather()
        }

    })
})


//Date and time
const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

setInterval(()=>{
    const time=new Date()
    const month=time.getMonth()
    const year=time.getFullYear()
    const date=time.getDate()
    const day=time.getDay()
    const hour=time.getHours()
    const hoursIn12HrFormat=hour>= 13 ? hour %12 : hour
    const minutes=time.getMinutes()
    const ampm=hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML=(hoursIn12HrFormat < 10 ? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' +(minutes < 10 ? '0'+minutes : minutes)+' '+`<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML=days[day]+' '+date+' '+months[month]+' '+year

},1000)

//Converting country code to name
function convertCountryCode(country){
    let regionNames=new Intl.DisplayNames(["en"],{type:"region"})
    return regionNames.of(country)
}


//Fetching API
function getWeather(){
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`).then(res=>res.json()).then(data=>
     {
        
        city.innerHTML=`${data.name}, ${convertCountryCode(data.sys.country)}`
        weather_forecast.innerHTML=`<p>${data.weather[0].main}</p>`
        weather_temp.innerHTML=`${data.main.temp.toFixed()}${units==="imperial" ? "&#176F" : "&#176C"}`
        weather_icon.innerHTML=`<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="img"/>`
        weather_minmax.innerHTML=`<p>Min: ${data.main.temp_min.toFixed()} &#176</p>
        <p>Max: ${data.main.temp_max.toFixed()} &#176</p>`
        weather_feelslike.innerHTML=`${data.main.feels_like.toFixed()} &#176`
        weather_humidity.innerHTML=`${data.main.humidity} %`
        weather_wind.innerHTML=`${data.wind.speed} ${units==="imperial" ? "mph" : "m/s"}`
        weather_pressure.innerHTML=`${data.main.pressure} hpa`
     })
}
document.body.addEventListener('load',getWeather())
