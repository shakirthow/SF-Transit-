$(document).ready(function() {
        initMaps()
        initTimeCards()
});

function initMaps() {
        var service;
        var map;
        var infowindow;

        getCurrentPosition = function() {
                if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(this.setGoogleMaps);
                } else {
                        alert("Geolocation is not supported by this browser.")
                }
        }
        setGoogleMaps = function(position) {
                var myLatlng = new google.maps.LatLng(37.7577, -122.4376);
                var mapOptions = {
                        // panControlOptions: {
                        //         // position: google.maps.ControlPosition.TOP_RIGHT
                        // },
                        // mapTypeControl: false,
                        // zoomControl: true,
                        // zoomControlOptions: {
                        //         style: google.maps.ZoomControlStyle.SMALL,
                        //         // position: google.maps.ControlPosition.TOP_RIGHT
                        // },
                        center: myLatlng,
                        // center: {lat:position.coords.latitude, lng: position.coords.longitude},
                        zoom: 13
                };
                map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                var contentString = 'test';
                infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 400
                });
                var request = {
                        location: myLatlng,
                        radius: 2500,
                        types: ['train_station', 'bus_station', 'subway_station', 'transit_station']
                };
                service = new google.maps.places.PlacesService(map);
                service.search(request, markerCallback);
                
                // var marker = new google.maps.Marker({
                //         position: myLatlng,
                //         map: map,
                //         test: 'test',
                //         title: 'Hello World!'
                // });
                // google.maps.event.addListener(marker, 'mouseover', function() { //
                //         infowindow.open(map, marker);
                // });
                // google.maps.event.addListener(marker, 'mouseout', function() {
                //         infowindow.close();
                // });
                // google.maps.event.addListener(marker, 'click', function() {
                //         infowindow.open(map, marker);
                // });
                // google.maps.event.addListenerOnce(map, 'idle', function() {
                //         //loaded fully
                // });


        }
        markerCallback = function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < results.length; i++) {
                                createMarker(results[i]);
                        }
                }
        }
        function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location
                });
                console.log(place)
                var content = '<strong style="font-size:1.2em">' + place.name + '</strong>' + '<br/><strong>Latitude:</strong>' + placeLoc.lat() + '<br/><strong>Longitude:</strong>' + placeLoc.lng() +
                '<br/><strong>Type:</strong>' + place.types[0] + '<br/><strong>Rating:</strong>' + (place.rating || 'n/a');
                var more_content = '<img src="http://googleio2009-map.googlecode.com/svn-history/r2/trunk/app/images/loading.gif"/>';
                
                //make a request for further details
                service.getDetails({
                        reference: place.reference
                }, function(place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                                more_content = '<hr/><strong><a href="' + place.url + '" target="details">Details</a>';
                                if (place.website) {
                                        more_content += '<br/><br/><strong><a href="' + place.website + '" target="details">' + place.website + '</a>';
                                }
                        }
                });
                google.maps.event.addListener(marker, 'click', function() {
                        infowindow.setContent(content + more_content);
                        infowindow.open(map, this);
                });
        }       
        getCurrentPosition()
}

function initTimeCards() {
        document.getElementById('add-to-list').onclick = function() {
                var list = document.getElementById('timeCardList');
                var newLI = document.createElement('li');
                newLI.className = "card";
                newLI.innerHTML =
                        '<div class="row title"> <div class="col-md-3 col-sm-3 col-lg-3"> <img class="logo" src="images/agents/bart.png"> </div> <div class="col-md-7 col-sm-7 col-lg-7"> <h4>Station Name</h4> </div> <div class="col-md-2 col-sm-2 col-lg-2"> <i onclick="removeCard($(this).parent().parent().parent())" class="glyphicon glyphicon-remove"></i> </div> </div> <div class="row"> <div class="col-md-7 col-sm-7 col-lg-7"> Bay Fair </div> <div class="col-md-2 col-sm-2 col-lg-2"> <span class="time"> 90</span> </div> <div class="col-md-2 col-sm-2 col-lg-2"> <span class="time"> 90</span> </div> <div class="col-md-1 col-sm-1 col-lg-1"></div> </div> <div class="row"> <div class="col-md-7 col-sm-7 col-lg-7"> SAF Airport </div> <div class="col-md-2 col-sm-2 col-lg-2"> <span class="time"> 90</span> </div> <div class="col-md-2 col-sm-2 col-lg-2"> <span class="time"> 90</span> </div> <div class="col-md-1 col-sm-1 col-lg-1"></div> </div> <div class="row alerts"><div class="col-md-4"><strong>Alert</strong></div><div class="col-md-8"> No alerts at this time</div></div>'
                list.appendChild(newLI);
                setTimeout(function() {
                        newLI.className = newLI.className + " show";
                }, 10);
        }
}

function removeCard(timeCardList) {
        $(timeCardList).removeClass('show')
        $(timeCardList).animate({
                height: 0,
                duration: 1500,
                specialEasing: {
                        height: "easeOutBounce"
                }
        });
        setTimeout(function() {
                $(timeCardList).remove()
        }, 500);
}