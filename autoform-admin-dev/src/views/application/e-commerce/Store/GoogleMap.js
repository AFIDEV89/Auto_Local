import React from 'react';
import { compose, withStateHandlers } from "recompose";
import Geocode from "react-geocode";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';
import { GoogleMap_API } from 'store/constant';
const Map = compose(
  withStateHandlers((props) => ({
    isMarkerShown: true,
    markerPosition: { lat: props?.latLang?.lat, lng: props?.latLang?.lng }
  }), {
    onMapClick: () => (e, getReverseGeocodingData) => {
      // getReverseGeocodingData(e.latLng);
      return ({
        markerPosition: e.latLng,
        isMarkerShown: true
      });
    }
  }),
  withScriptjs,
  withGoogleMap
)
  (props =>
    <GoogleMap
      defaultZoom={16}
      defaultCenter={{ lat: props.latLang?.lat, lng: props.latLang?.lng }}
      onClick={(e) => { props.onMapClick(e, props.getReverseGeocodingData); }}
    >
      {props.isMarkerShown && <Marker position={props.markerPosition} />}

    </GoogleMap>
  );

export default class MapContainer extends React.Component {

  getCompleteAddress = (value) => {
    // let countryCode = '';
    let state = '';
    let city = '';
    let postCode = '';
    let county = '';
    let streetAddress = '';
    if (value && value.address_components) {
      for (const addressComp of value?.address_components) {
        if (addressComp?.types.includes("street_number") || addressComp?.types.includes("route") || addressComp?.types.includes("neighborhood") || addressComp?.types.includes("sublocality_level_1")) {
          streetAddress = `${streetAddress} ${addressComp?.long_name}`;
          // this.props.setAddress(streetAddress);
        }
        if (addressComp?.types.includes('country')) {
          // countryCode = addressComp?.short_name;
        }
        if (addressComp?.types.includes('administrative_area_level_1')) {
          state = addressComp?.long_name;
          this.props.setState(state);
        } else {
          // this.props.setState('');
        }
        if (addressComp?.types.includes('locality')) {
          city = addressComp?.short_name;
          this.props.setCity(city);
        } else {
          // this.props.setCity('');
        }
        if (addressComp?.types.includes('postal_code')) {
          postCode = addressComp?.short_name;
          this.props.setPincode(postCode);
        } else {
          // this.props.setPincode('');
        }
        if (addressComp?.types.includes("country")) {
          county = addressComp?.long_name;
          this.props.setCountry(county);
        } else {
          // this.props.setCountry('');
        }
      }

    } else {
      // if the user presses enter
      streetAddress = value?.updatedStreetAddress;
    }
  };

  getReverseGeocodingData = (latVal, lngVal) => {
    // let langlatData = lat.split('(');

    let newStr = latVal.replace(/[\])}[{(]/g, '');

    let lat = newStr.split(',')[0];
    let lng = newStr.split(',')[1];

    if (!!lat && !!lng) {
      Geocode.setApiKey(GoogleMap_API);
      Geocode.enableDebug();

      Geocode.fromLatLng(lat, lng).then(
        response => {

          const address = response.results[0].formatted_address;
          this.props.setAddress(address);
          this.props.setStoreAddress(address);
          this.props.setLatitude(+lat);
          this.props.setLongitude(+lng);
        },
        error => {
          console.error(error);
        }
      );

    }



  };
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Map
          latLang={this.props.locationLatLang}
          getReverseGeocodingData={this.getReverseGeocodingData}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMap_API}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
};


