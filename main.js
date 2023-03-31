//get the location
let coords 
const myMap={
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// build leaflet map
	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)
		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},

	// add business markers
	addMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

async function getLocation(){
    const location = await new Promise((resolve, reject)=>{
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [location.coords.latitude, location.coords.longitude]
}


//map the location
async function generateMap(coords){
    
    
    const myMap = L.map('map',{
        center: [coords[0],coords[1]],
        zoom: 15,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15',
}).addTo(myMap)


const userLocation = L.marker([coords[0],coords[1]])
userLocation.addTo(myMap).bindPopup('<p1><b>You Are Here</b></p1>')


}


  
// get the food gas or coffee places

async function getFoursquare(business) {
    const options = {
     method: 'GET',
     headers: {
      Accept: 'application/json',
      Authorization: 'fsq3zHefPw8Rinq8FOTzpEsK9XN9+vW6dhMzj0n5P1QI8eE='
     }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return businesses
   }

   function processBuissness(data){
        let businesses = data.map((element) => {
            let location = {
                name: element.name,
                lat: element.geocodes.main.latitude,
                long: element.geocodes.main.longitude
            };
            return location
        })
        return businesses
    }



document.getElementById('submit').addEventListener('click', async(e)=>{
    e.preventDefault()
    let business = document.getElementById('markerChoice').value
    console.log(business)
    let data = await getFoursquare(business)
    myMap.businesses = processBuissness(data)
    myMap.addMarkers()

})

window.onload=async()=>{
    const coords = await getLocation()
    myMap.coordinates = coords
    myMap.buildMap()

}