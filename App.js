import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import btlogo from './assets/bluetooth-logo.png';

export const manager = new BleManager();

export default function App() {
  // const scanAndConnect = () => {
  //   console.log("scanAndConnect");
  //   manager.startDeviceScan(null, null, (error, device) => {
  //     if (error) {
  //         // Handle error (scanning will be stopped automatically)
  //         return
  //     }

  //     console.log("Found",device.name, device.localName);

  //     // Check if it is a device you are looking for based on advertisement data
  //     // or other criteria.
  //     // if (device.name === 'TI BLE Sensor Tag' || 
  //     //     device.name === 'SensorTag') {
          
  //     //     // Stop scanning as it's not necessary if you are scanning for one device.
  //     //     manager.stopDeviceScan();

  //     //     // Proceed with connection.
  //     // }
  //   });
  // }

  // React.useEffect(() => {
  //   console.log("Setting up initial manager subscription");
  //   manager.onStateChange((state) => {
  //     const subscription = manager.onStateChange((state) => {
  //         if (state === 'PoweredOn') {
  //             scanAndConnect();
  //             subscription.remove();
  //         }
  //     }, true);
  //     return () => subscription.remove();
  //   });
  // }, [manager]);

  return (
    <View style={styles.container}>
      <Image source={btlogo} style={styles.logoImage}/>
      <Text>React Native Bluetooth Example</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 132,
    resizeMode: 'stretch'
  }
});