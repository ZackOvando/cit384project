import React, { useRef, useCallback, useState } from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.73061,
  lng: -73.935242,
};

const libraries = ['places'];

function Map() {

  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const fetchRestaurants = async (category, zipCode, radiusInMiles) => {
    if (!mapRef.current) return;

    try {
      const latLng = await getLatLngFromZipCode(zipCode);
      const radiusInMeters = radiusInMiles * 1609.34; // Convert miles to meters

      const service = new window.google.maps.places.PlacesService(mapRef.current);

      const request = {
        location: latLng,
        radius: radiusInMeters,
        type: 'restaurant',
        keyword: category,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          createMarkers(results);
        }
      });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }

  };

  const getLatLngFromZipCode = async (zipCode) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyBan1JCBFtscrT018roF6rCo2HzGgy9xU8`
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch coordinates for the zip code');
    }

    const data = await response.json();
    const location = data.results[0].geometry.location;

    return { lat: location.lat, lng: location.lng };
  };

  const createMarkers = (restaurants) => {
    const newMarkers = restaurants.map((restaurant) => {
      const marker = new window.google.maps.Marker({
        position: restaurant.geometry.location,
        map: mapRef.current,
        title: restaurant.name,
      });

      return { marker, restaurant };
    });

    setMarkers((prevMarkers) => {
      // Remove previous markers from the map
      prevMarkers.forEach(({ marker }) => marker.setMap(null));

      // Return the new markers and restaurant details
      return newMarkers;
    });
  };


  return (
    <div style={{ height: '600px', width: '100%' }}>
      <LoadScript googleMapsApiKey="AIzaSyBan1JCBFtscrT018roF6rCo2HzGgy9xU8" libraries={libraries}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={14}
          onLoad={onMapLoad}
        >
          {markers.map(({ marker, restaurant }) => (
            <InfoWindow key={restaurant.place_id} position={marker.getPosition()}>
              <div>
                <h4>{restaurant.name}</h4>
                {/* Add any other restaurant details you want to display */}
              </div>
            </InfoWindow>
          ))}
        </GoogleMap>

      </LoadScript>

      <button onClick={() => fetchRestaurants('Italian', '91326', 1)}>Find Italian Restaurants</button>

    </div>
  );
}

export default React.forwardRef((props, ref) => <Map />);