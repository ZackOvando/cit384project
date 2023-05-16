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

  useEffect(() => {
    L.mapquest.key = 'YOUR_MAPQUEST_KEY';  // replace with your MapQuest key

    var map = L.mapquest.map('map', {  // 'map' is the id of the div where the map will be rendered
      center: [40.7128, -74.0060],
      layers: L.mapquest.tileLayer('map'),
      zoom: 12
    });

    map.addControl(L.mapquest.control());
  }, []);
    

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>

    </div>
  );
}

export default React.forwardRef((props, ref) => <Map />);

/*

<div id="map" style={{ width: '100%', height: '500px' }}></div>

*/


/*

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
                
                </div >
                </InfoWindow >
              ))}
            </GoogleMap >
    
          </LoadScript >

  <button onClick={() => fetchRestaurants('Italian', '91326', 1)}>Find Italian Restaurants</button>
    
        </div >

*/

/*
import React, { useRef, useCallback, useState } from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import './main.css'
import { ButtonCustom } from '../../components/button/button'
import FormContainer from '../../components/forms/form-container/form-container'
import { SelectForm, NumberForm, Form, ToggleForm } from '../../components/forms/form/form'
import { connect } from 'react-redux';
import { setCategory, setRadiusSearch, setZipCode } from '../../redux/actions/restaurantActions'



const Main = (props) => {

  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);



  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const defaultCenter = {
    lat: 40.73061,
    lng: -73.935242,
  };

  const libraries = ['places'];

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const fetchRestaurants = async (category, zipCode, radiusInMiles) => {
    console.log('IN FUNCTION')
    console.log(zipCode)
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
    console.log('MARKERS')
    console.log(newMarkers)
    if (newMarkers.length === 0) {
      alert('NO RESTAURANTS WITHIN THAT RADIUS')
    }

    setMarkers((prevMarkers) => {
      // Remove previous markers from the map
      prevMarkers.forEach(({ marker }) => marker.setMap(null));

      // Return the new markers and restaurant details
      return newMarkers;
    });
  };
  console.log('category', props.category)
  console.log('radius', props.radius)
  console.log('zip', props.zipcode)
  console.log(markers)
  return (

    <div id='main-container'>

      <FormContainer>

        <h1>Time to Grub!</h1>

        <Form label="What are you in the mood for?" helperText={"ff theres an error"} value={props.category} function={props.setCategory} />

        <ToggleForm label="How far should we look in miles?" helperText={"Afdasf"} value={props.radius} function={props.setRadiusSearch} />

        <NumberForm label="What's your zip code?" value={props.zipcode} function={props.setZipCode} />

        <ButtonCustom buttonTitle={"Search NOW"} function={() => fetchRestaurants(props.category, props.zipcode, props.radius)} />

      </FormContainer>

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
                {
                  restaurant.name === '' ? <div>
                    <h4>Test</h4>
                  </div> : <div>
                    <h4>{restaurant.name}</h4>
                  </div>
                }
              </InfoWindow>
            ))}
          </GoogleMap>

        </LoadScript>

      </div>

    </div>

  )
}

const mapStateToProps = (state) => ({
  category: state.restaurant.category,
  radius: state.restaurant.radiusSearch,
  zipcode: state.restaurant.zipCode,
});

const mapDispatchToProps = (dispatch) => ({
  setCategory: (category) => dispatch(setCategory(category)),
  setRadiusSearch: (radius) => dispatch(setRadiusSearch(radius)),
  setZipCode: (zipcode) => dispatch(setZipCode(zipcode))
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

*/


