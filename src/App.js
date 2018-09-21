import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const dynamicTableData = [];

class DynamicTable extends Component {

  render() {
    dynamicTableData.unshift(
      <tr key={this.props.latitude}>
        <td>{this.props.timestamp}</td>
        <td>{this.props.latitude}</td>
        <td>{this.props.longitude}</td>
      </tr>
    )

    return (
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {dynamicTableData.slice(0, dynamicTableData.length - 1).slice(0, 10)}
        </tbody>
      </table>
    )
  }
}

const ConvertTime = (props) => {
  const unixTime = props.unixTime
  var date = new Date(unixTime * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return (
    <span>{formattedTime}</span>
  )

}

class IssApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: null,
      latitude: '',
      longitude: ''
    }
  }

  componentDidMount() {
    axios.get('http://api.open-notify.org/iss-now.json')
      .then(res => {
        const issData = res.data;
        const timestamp = issData.timestamp;
        const latitude = issData.iss_position.latitude;
        const longitude = issData.iss_position.longitude;
        this.setState({
          timestamp: timestamp,
          latitude: latitude,
          longitude: longitude
        })
      })
    this.timerID = setInterval(
      () => this.refreshIssData(),
      3000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  refreshIssData() {
    axios.get('http://api.open-notify.org/iss-now.json')
      .then(res => {
        const issData = res.data;
        const timestamp = issData.timestamp;
        const latitude = issData.iss_position.latitude;
        const longitude = issData.iss_position.longitude;
        this.setState({
          timestamp: timestamp,
          latitude: latitude,
          longitude: longitude
        })
      })
  }

  render() {
    return (
      <div>
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds">
          <div className="current-data">
            <h1>INTERNATIONAL SPACE STATION TRACKER</h1>
            <table className="pure-table">
              <tbody>
                <tr>
                  <td>Timestamp (UNIX):</td>
                  <td className="data-point">{this.state.timestamp}</td>
                </tr>
                <tr>
                  <td>Timestamp (natural):</td>
                  <td className="data-point"><ConvertTime unixTime={this.state.timestamp} /></td>
                </tr>
                <tr>
                  <td>Latitude:</td>
                  <td className="data-point">{this.state.latitude}</td>
                </tr>
                <tr>
                  <td>Longitude:</td>
                  <td className="data-point">{this.state.longitude}</td>
                </tr>
              </tbody>
            </table>
            <div className="dynamic-table">
              <DynamicTable
                timestamp={<ConvertTime unixTime={this.state.timestamp} />}
                latitude={this.state.latitude}
                longitude={this.state.longitude}
              />
            </div>
          </div></div>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <IssApi />
      </div>
    );
  }
}

export default App;


