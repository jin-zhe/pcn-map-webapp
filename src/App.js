import React, { Component } from 'react';
// import logo from './logo.svg';
import style from './style';
import { Map, TileLayer, GeoJSON, CircleMarker, Circle, Popup } from 'react-leaflet';
import pcn_geojson from './pcn_geojson.json';

const basemap = 'https://maps-{s}.onemap.sg/v3/Grey/{z}/{x}/{y}.png';
const attribution = 'New OneMap | Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>';
const mapCenter = [1.3603649999999998, 103.808375];
const zoomLevel = 13;
const minZoom = 12;
const maxZoom = 18;
const maxBounds = [[1.56073, 104.1147], [1.16, 103.502]];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      currentZoomLevel: zoomLevel,
      currentPositionMarker: {
        show: false,
        position: mapCenter,
        accuracy: 2
      }
    };
  }

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.locate({
      enableHighAccuracy: true,
      watch: true
    });
    leafletMap.on('locationfound', (e) => {
      this.handleCurrentPositionMarker(true, e.latlng, e.accuracy);
      leafletMap.setView(e.latlng, 18); // pan and zoom to current pos
    });
    leafletMap.on('locationerror', (e) => {
      alert(e.message);
      this.handleCurrentPositionMarker(false, 0, 0);
      // DUMMY DATA TODO
      // const location = [1.337673, 103.696923];
      // this.handleCurrentPositionMarker(true, location, 50);
      // leafletMap.setView(location, 18); // pan and zoom to current pos
    });
  }

  handleZoomLevel(currentZoomLevel) {
    this.setState({ currentZoomLevel: currentZoomLevel })
  }

  handleCurrentPositionMarker(show, latlng, accuracy) {
    this.setState({ currentPositionMarker: {
      show: show,
      position: latlng,
      accuracy: accuracy
      }
    })
  }

  getStyle(feature, layer) {
    const colors = {
      'central urban loop':           '#C6007E',
      'eastern coastal loop':         '#008C95',
      'north eastern riverine loop':  '#7D55C7',
      'northern explorer loop':       '#FCD116',
      'southern ridges loop':         '#215732',
      'western adventure loop':       '#F99B0C' 
    }
    return {
      color: colors[feature.properties.pcn_loop],
      weight: 3,
      opacity: 0.88
    }
  }

  render() {
    function CurrentPositionMarker(props) {
      if (props.show) {
        return (
          <CircleMarker
            key="currentPos"
            center={ props.position }
            radius={ 8 }
            fill={ true }
            color={ "#FFFFFF" }
            weight={ 3 }
            fillColor={ "#4285F4" }
            fillOpacity={ 1 }
          >
            <Popup>
              <span>{`You are within ${props.accuracy / 2} meters from this point`}</span>
            </Popup>
            <Circle
              center={ props.position }
              radius={ props.accuracy/2 }
              fill={ true }
              color={ "#88B5DC" }
              weight={ 1 }
              fillColor={ "#88B5DC" }
              fillOpacity={ 0.3 }
            >
            </Circle>
          </CircleMarker>
        )
      }
      return null;
    }

    return (
      <div style={ style.fullHeight }>
        <Map
          ref={m => { this.leafletMap = m; }}
          center={ mapCenter }
          zoom={ this.state.currentZoomLevel }
          maxBounds={ maxBounds }
          minZoom={ minZoom }
          maxZoom={ maxZoom }
          style={ style.leafletContainer }
        >
          <TileLayer
            attribution={ attribution }
            url={ basemap }
          />
          <GeoJSON data={ pcn_geojson } style={ this.getStyle } />
          <CurrentPositionMarker
            show={ this.state.currentPositionMarker.show }
            position={ this.state.currentPositionMarker.position }
            accuracy={ this.state.currentPositionMarker.accuracy} />
        </Map>
      </div>
    );
  }
}

export default App;
