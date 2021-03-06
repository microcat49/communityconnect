import React, { Component } from 'react';
import Header from './components/Header/Header';
import ResultList from './components/ResultList';
import Map from './components/Map/Map';
import { callSheets } from './data/sheetLoadingHelpers.js';
import styles from './App.module.css';
import SplitScreenSlidingPane from './components/SlidingPane/SplitScreenSlidingPane.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgs: [],
      categories: [],
      tags: [],
      haveCoords: false,
      locationAddressHashTable: [],
        isBostonVisible: false,
      isWalkArlingtonVisible: false,
      isWalkCharlesTownVisible: false,
    }

    this.callSheets = callSheets.bind(this);
  }

  getLocation = () => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position)
          this.setState({
            position: {
              coordinates: {
                lat: parseFloat(position.coords.latitude),
                lng: parseFloat(position.coords.longitude)
              }
            }
          })
          this.setState({ haveCoords: true })
        },
        error => {
          console.log('Unable to get Coordinates');
          this.setState({ haveCoords: false })
        });
    } else {
      console.log('no geolocation');
      this.setState({ haveCoords: false })
    }
  }

  componentDidMount() {
    this.callSheets("");
    this.getLocation();
  }

  cardClick = (index) => {
    this.mapItem.setOpenMarker(index);
  }

  scrollToElement = index => {
    this.resultListItem.scrollToElement(index);
  }

    handleWalkWayClick = (value) => {
      if(value === "boston"){
        this.setState((prevState) => {
            return ({isBostonVisible : !prevState.isBostonVisible})
        })
      }

      if(value === "chelsea"){
          this.setState((prevState) =>{
              return ({isWalkArlingtonVisible : !prevState.isWalkArlingtonVisible})
          })
      }

      if(value === "charlestown"){
          this.setState((prevState) => {
              return ({isWalkCharlesTownVisible : !prevState.isWalkCharlesTownVisible})
          })
      }
    }

  render() {
    const navbarHeight = 56;

    let map =
      <Map
        center={this.state.position ? this.state.position.coordinates : null}
        organizations={this.state.orgs}
        scrollToElement={this.scrollToElement}
        ref={instance => { this.mapItem = instance }}
        locationAddressHashTable={this.state.locationAddressHashTable}
        isBostonVisible={this.state.isBostonVisible}
        isWalkArlingtonVisible={this.state.isWalkArlingtonVisible}
        isWalkCharlesTownVisible={this.state.isWalkCharlesTownVisible}
      />

    return (
      <div className={styles.viewport}>
        <div className={styles.header}>
          <Header
            categories={this.state.categories}
            handleEvent={this.callSheets}
            handleFilter={this.callSheets}
            handleWalkWayClick={this.handleWalkWayClick}
          />
        </div>
        <div id={styles.container}>
          <SplitScreenSlidingPane>
            <ResultList
              haveCoords={this.state.haveCoords}
              ref={instance => { this.resultListItem = instance }}
              cardClick={this.cardClick}
              data={this.state.orgs}
              haveCoords={this.state.haveCoords}
              currentPos={this.state.position}
            />
          </SplitScreenSlidingPane>
          <div className={styles.staticPane}>
            {map}</div>
        </div>
      </div>
    );
  }
}


export default App;
