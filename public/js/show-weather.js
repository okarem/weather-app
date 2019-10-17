const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('city');
fetch("/getweather").then(response=> response.json()).then(data1=>{
    console.log(data1);
    
    


}).catch(err=>{console.log(err)});