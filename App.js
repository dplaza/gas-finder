import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Platform, FlatList, Image } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { ListItem} from 'react-native-elements'
import * as commonStyle from './styles/common'
import moment from 'moment'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      location: null,
      errorMessage: null,
      prices: []
    };
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  listPrices() {
    const result = [
      {
        index: '1',
        gasStation: { name: 'COPEC', address: 'AV. FEDERICO STA. MARIA 2044,Valparaíso' },
        price: 516,
        lastUpdate: moment("2018-04-26T15:27:41.000")
      },
      {
        index: '2',
        gasStation: { name: 'COPEC', address: 'COMBATE LAS COIMAS 1412,San Felipe' },
        price: 526,
        lastUpdate: moment("2018-04-26T15:27:41.000")
      },
      {
        index: '3',
        gasStation: { name: 'SHELL', address: 'Normandie 2077,Quintero' },
        price: 536,
        lastUpdate: moment("2018-04-26T15:27:41.000")
      }
    ]
    this.setState({
      prices: result
    })
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    this.listPrices()
  }

  _hello() {
    Alert.alert('wiii')
  }

  _principalPrice () {
    if (this.state.prices.length > 0) {
      return JSON.stringify(this.state.prices[0])
    }
    return ''
  }

  render() {
    let textLocation = "Locating device..."
    if (this.state.errorMessage) {
      textLocation = this.state.errorMessage;
    } else if (this.state.location) {
      textLocation = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <View style={styles.initialInfo}>
          {/* <Button title="Mi bencina BBB" onPress={this._hello} style={styles.btn} color="#C19875"></Button> */}
          <Text style={styles.textLocation}>{textLocation}</Text>
        </View>
        <View style={styles.principalBox}>
          <Image source={{uri: "https://www.smtm.co/uploads/logo/13/48/22/1348222b4100b29d2e801c22fff80324.png"}} style={{width: 300, height: 50, resizeMode: Image.resizeMode.contain}} />
          <Text>{this._principalPrice()}</Text>
        </View>
        <FlatList
          style={styles.listPrices}
          data={this.state.prices}
          keyExtractor={item => item.index}
          renderItem={({item}) => (
            <ListItem
              key={item.index}
              leftAvatar={{ source: { uri: 'http://www.diariocronica.cl/wp-content/uploads/2014/03/logo-copec.jpg' } }}
              title={item.gasStation.name}
              titleStyle={{ color: commonStyle.COLOR_FONT }}
              subtitle={item.gasStation.address}
              subtitleStyle={{ color: commonStyle.COLOR_BG }}
              badge={{ value: `$${item.price}`, textStyle: { color: commonStyle.COLOR_FONT }, containerStyle: { marginTop: 10 } }}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyle.COLOR_BG_2,
    justifyContent: 'center',
  },
  initialInfo: {
    marginTop: 40,
    marginBottom: 20
  },
  principalBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  btn: {
    backgroundColor: commonStyle.COLOR_BTN
  },
  textLocation: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20,
    color: commonStyle.COLOR_FONT
  },
  listPrices: {
    flex: 2
  }
});
