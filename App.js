import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Platform, FlatList, Image, Picker, ActivityIndicator } from 'react-native';
import { Constants, Location, Permissions, Linking } from 'expo';
import { ListItem} from 'react-native-elements'
import * as commonStyle from './styles/common'
import moment from 'moment'
import axios from 'axios'

const BASE_API = 'http://192.168.0.17:3000/api/getByRegion'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      location: null,
      errorMessage: null,
      prices: [],
      region: null,
      city: null,
      gasType: null
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

  listPrices = async () => {
    if (!this.state.region || !this.state.gasType) {
      return
    }

    this.setState({
      isLoading: true,
      prices: []
    })

    try {
      let response = await axios.post(BASE_API, {
        region: this.state.region,
        gasType: this.state.gasType
      })
      this.setState({
        isLoading: false,
        prices: response.data
      })
    } catch (err) {
      console.error(err)
    }
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
  }

  _openMaps (obj) {
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
    const address = encodeURI(obj.gasStation.address);
    const label = 'Custom Label';
    const url = Platform.OS === 'ios' ? `${scheme}${label}@${address}` : `${scheme}${address}`;

    Linking.openURL(url);
  }

  _changeRegion (value) {
    if (value) {
      this.setState({
        region: value
      })
    }
  }

  _changeGasType (value) {
    if (value) {
      this.setState({
        gasType: value
      })
    }
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
        <Text style={styles.textLocation}>{textLocation}{this.state.region}</Text>
        <View style={styles.initialInfo}>
          <Picker
            selectedValue={this.state.region}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => this._changeRegion(itemValue)}>
            <Picker.Item value="" label="Seleccione Región" />
            <Picker.Item value="1" label="Arica y Parinacota" />
            <Picker.Item value="2" label="Tarapacá" />
            <Picker.Item value="3" label="Antofagasta" />
            <Picker.Item value="4" label="Atacama" />
            <Picker.Item value="5" label="Coquimbo" />
            <Picker.Item value="6" label="Valparaíso" />
            <Picker.Item value="7" label="Metropolitana" />
            <Picker.Item value="8" label="Gral. Bernardo O'Higgins" />
            <Picker.Item value="9" label="Maule" />
            <Picker.Item value="10" label="Bío Bío" />
            <Picker.Item value="11" label="Araucanía" />
            <Picker.Item value="12" label="Los Ríos" />
            <Picker.Item value="13" label="Los Lagos" />
            <Picker.Item value="14" label="Aysén Gral. C. Ibáñez del Campo" />
            <Picker.Item value="15" label="Magallanes y la Antártida Chilena" />
          </Picker>
          <Picker
            selectedValue={this.state.gasType}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => this._changeGasType(itemValue)}>
            <Picker.Item value="" label="Seleccione Tipo Combustible" />
            <Picker.Item value="1" label="Gasolina 93" />
            <Picker.Item value="7" label="Gasolina 95" />
            <Picker.Item value="2" label="Gasolina 97" />
            <Picker.Item value="6" label="GLP Vehicular" />
            <Picker.Item value="5" label="GNC" />
            <Picker.Item value="4" label="Kerosene" />
            <Picker.Item value="3" label="Petroleo Diesel" />
          </Picker>
          <Button title="Buscar" color={commonStyle.COLOR_RED} onPress={this.listPrices}></Button>
        </View>
        {this.state.isLoading && <ActivityIndicator size="large" style={styles.loadingIndicator} color={commonStyle.COLOR_WHITE} />}
        <FlatList
          style={styles.listPrices}
          data={this.state.prices}
          keyExtractor={item => item.index}
          renderItem={({item}) => (
            <ListItem
              key={item.index}
              title={item.gasStation.name}
              titleStyle={{ color: commonStyle.COLOR_WHITE }}
              subtitle={item.gasStation.address}
              subtitleStyle={{ color: commonStyle.COLOR_LIGHT_BLUE }}
              onPress={() => this._openMaps(item)}
              onPressRightIcon={() => this._openMaps(item)}
              badge={{ value: `$${item.price}`, textStyle: { color: commonStyle.COLOR_WHITE }, containerStyle: { marginTop: 10 } }}
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
    backgroundColor: commonStyle.COLOR_DARK_BLUE,
    justifyContent: 'center'
  },
  initialInfo: {
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: commonStyle.COLOR_WHITE,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5
  },
  btn: {
    backgroundColor: commonStyle.COLOR_RED
  },
  textLocation: {
    marginTop: 40,
    marginRight: 20,
    marginLeft: 20,
    color: commonStyle.COLOR_YELLOW
  },
  listPrices: {
    flex: 2
  },
  loadingIndicator: {
    marginTop: 20
  },
  picker: {
    color: commonStyle.COLOR_DARK_BLUE
  }
});
