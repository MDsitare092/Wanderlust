 mapboxgl.accessToken = mapToken;

     const map = new mapboxgl.Map({
     container: "map", // container ID
    
     center: listing.geometry.coordinates , // starting position -> ye bhopal coordinates ka hai 
     zoom: 10 // starting zoom
});



 const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup( new mapboxgl.Popup({offset: 25 })
        .setHTML(
            `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
          ))
    
        .addTo(map);
