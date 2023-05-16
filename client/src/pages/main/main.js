import React, { useRef, useCallback, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import './main.css'
import { ButtonCustom } from '../../components/button/button'
import FormContainer from '../../components/forms/form-container/form-container'
import { SelectForm, NumberForm, Form, ToggleForm } from '../../components/forms/form/form'
import { connect } from 'react-redux';
import { setCategory, setRadiusSearch, setZipCode } from '../../redux/actions/restaurantActions'
import axios from "axios"

const Main = (props) => {

  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const [city, setCity] = useState("New York");  // replace with actual city
  const [radius, setRadius] = useState(10);  // replace with actual radius
  const [data, setData] = useState(null);
  const [error, setError] = useState("")

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
    console.log('IN FUNCTION TEST TREST')
    console.log(zipCode)

    const apiKey = 'ck2OXUAJsF0iz999XGQ62jyXo8AXOVp7';
    const apiUrl = `https://www.mapquestapi.com/search/v2/radius?key=${apiKey}&origin=${zipCode}&radius=10&maxMatches=${radiusInMiles}&ambiguities=ignore&hostedData=mqap.ntpois|group_sic_code=?|581208`;
    try {

      await axios.get(apiUrl)
        .then(response => {
          // Process the response data

          const allRestaurants = response.data.searchResults;
          console.log(response.data.searchResults)
          const CategorizedRestaurants = allRestaurants.filter(restaurant =>
            restaurant.fields.name.toLowerCase().includes(category.toLowerCase())
          );


          if (CategorizedRestaurants.length === 0) {
            setError(`No ${category} restaurants found`)
          }

          createMarkers(CategorizedRestaurants, zipCode,radiusInMiles);
        })
        .catch(error => {
          // Handle any errors
          console.error(error);
        });


    } catch (error) {
      setError(error.message)
      console.error("Error: ", error);
    }

    /*
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
*/
  };

  const getLatLngFromZipCode = async (zipCode) => {
    console.log(zipCode)
    /*
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
    */
  };
  // console.log('category', props.category)
  // console.log('radius', props.radius)
  // console.log('zip', props.zipcode)
  // console.log(markers)

  console.log(data)

  const createMarkers = async (result, zipCode) => {

    const response = await axios.get(`https://www.mapquestapi.com/geocoding/v1/address?key=${window.L.mapquest.key}&location=${zipCode}`);

    const location = response.data.results[0].locations[0].latLng;

    var searchResults = result;

    searchResults.forEach(element => {
      window.L.marker([element.fields.disp_lat, element.fields.disp_lng], {
        icon: window.L.mapquest.icons.marker(),
        draggable: false
      }).bindPopup(element.fields.name).addTo(mapRef.current);
    });

    // Update the map view to the zipCode location

    mapRef.current.setView([location.lat, location.lng], 10);

  }



  useEffect(() => {
    if (!mapRef.current) {  // if map is not initialized
      window.L.mapquest.key = 'ck2OXUAJsF0iz999XGQ62jyXo8AXOVp7';  // replace with your MapQuest key

      mapRef.current = window.L.mapquest.map('map', {  // 'map' is the id of the div where the map will be rendered
        center: [40.7128, -74.0060],
        layers: window.L.mapquest.tileLayer('map'),
        zoom: 12
      });

      mapRef.current.addControl(window.L.mapquest.control());
    }
  }, []);

  useEffect(() => {
    setInterval(() => {
      setError('');
    }, 5000);
  }, [error])



  return (

    <div id='main-container'>

      <FormContainer>

        <h1>Time to Grub!</h1>

        <Form label="What are you in the mood for?" helperText={"ff theres an error"} value={props.category} function={props.setCategory} />

        <ToggleForm label="How far should we look in miles?" helperText={"Afdasf"} value={props.radius} function={props.setRadiusSearch} />

        <NumberForm label="What's your zip code?" value={props.zipcode} function={props.setZipCode} />
        <p>{error}</p>
        <ButtonCustom buttonTitle={"Search NOW"} function={() => fetchRestaurants(props.category, props.zipcode, props.radius)} />

      </FormContainer>

      <div style={{ height: '600px', width: '100%' }}>
        {
          /*
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
        */
        }


        <div id="map" style={{ width: '100%', height: '500px' }}></div>

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
