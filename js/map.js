jQuery(document).ready(function($){


    if($('.map').length){
        var mapEleement = $('.map'),
            mapId = mapEleement.attr("id");

        var city = {
            lan: '50.4458818',
            lat: '30.5130252',
            title: 'Vkursi',
        };
        
        function initialize() {
            var myLatlng = new google.maps.LatLng(city.lan, city.lat),
                mapOptions = {
                    zoom: 9,
                    center: myLatlng,
                    zoomControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    styles: [
                        {
                            "featureType": "administrative.locality",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "hue": "#2c2e33"
                                },
                                {
                                    "saturation": 7
                                },
                                {
                                    "lightness": 19
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "hue": "#ffffff"
                                },
                                {
                                    "saturation": -100
                                },
                                {
                                    "lightness": 100
                                },
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "hue": "#ffffff"
                                },
                                {
                                    "saturation": -100
                                },
                                {
                                    "lightness": 100
                                },
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "hue": "#bbc0c4"
                                },
                                {
                                    "saturation": -93
                                },
                                {
                                    "lightness": 31
                                },
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "hue": "#bbc0c4"
                                },
                                {
                                    "saturation": -93
                                },
                                {
                                    "lightness": 31
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "labels",
                            "stylers": [
                                {
                                    "hue": "#bbc0c4"
                                },
                                {
                                    "saturation": -93
                                },
                                {
                                    "lightness": -2
                                },
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "hue": "#e9ebed"
                                },
                                {
                                    "saturation": -90
                                },
                                {
                                    "lightness": -8
                                },
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "hue": "#e9ebed"
                                },
                                {
                                    "saturation": 10
                                },
                                {
                                    "lightness": 69
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "hue": "#e9ebed"
                                },
                                {
                                    "saturation": -78
                                },
                                {
                                    "lightness": 67
                                },
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        }
                    ]
                };
            var map = new google.maps.Map(document.getElementById(mapId), mapOptions);

            var markerPosition = new google.maps.LatLng(city.lan, city.lat);
            var marker = new google.maps.Marker({
                position: markerPosition,
                map: map,
                title: city.title,
            });


            google.maps.event.addDomListener(window, "resize", function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });
        }
        google.maps.event.addDomListener(window, 'load', initialize);
    }
});