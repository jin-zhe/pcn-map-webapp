import React, { Component } from 'react';
// import logo from './logo.svg';
import style from './style';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
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
    this.state = { currentZoomLevel: zoomLevel };
  }

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.on('zoomend', () => {
      const updatedZoomLevel = leafletMap.getZoom();
      this.handleZoomLevelChange(updatedZoomLevel);
    });
  }

  handleZoomLevelChange(newZoomLevel) {
    this.setState({ currentZoomLevel: newZoomLevel });
  }

  handleUpPanClick = () => {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.panBy([0, -100]);
    window.console.log('Panning up');
  }

  handleRightPanClick = () => {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.panBy([100, 0]);
    window.console.log('Panning right');
  }

  handleLeftPanClick = () => {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.panBy([-100, 0]);
    window.console.log('Panning left');
  }

  handleDownPanClick = () => {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.panBy([0, 100]);
    window.console.log('Panning down');
  }

  getStyle(feature, layer) {
    return {
      color: '#FF0000',
      weight: 5,
      opacity: 0.65
    }
  }

  render() {
    window.console.log('this.state.currentZoomLevel ->', this.state.currentZoomLevel);

    return (
      <div style={ style.fullHeight }>
        <Map
          ref={m => { this.leafletMap = m; }}
          center={ mapCenter}
          zoom={ zoomLevel }
          maxBounds={ maxBounds }
          minZoom={ minZoom }
          maxZoom={ maxZoom }
          style={ style.leafletContainer }
        >
          <TileLayer
            attribution={ attribution }
            url={ basemap }
          />
          <GeoJSON data={pcn_geojson} style={this.getStyle} />
        </Map>
        <div>
          <div>
            <div style={{ marginLeft: '37px' }}>
              <button onClick={ this.handleUpPanClick }>
                  Pan up
              </button>
            </div>
            <div>
              <button onClick={ this.handleLeftPanClick }>
                  Pan left
              </button>
              <button onClick={ this.handleRightPanClick }>
                  Pan right
              </button>
            </div>
            <div style={{ marginLeft: '30px' }}>
              <button onClick={ this.handleDownPanClick }>
                  Pan down
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
