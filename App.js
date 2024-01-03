import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import btlogo from "./assets/bluetooth-logo.png";
import { ApplicationProvider, Button } from "@ui-kitten/components";
import * as eva from '@eva-design/eva';

export const manager = new BleManager();

const App = () => {
  const [devices, setDevices] = useState([]);

  requestBluetoothPermission = async () => {
    if (Platform.OS === "ios") {
      return true;
    }
    if (
      Platform.OS === "android" &&
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ) {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      if (
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          result["android.permission.BLUETOOTH_CONNECT"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_SCAN"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }

    this.showErrorToast("Permission have not been granted");

    return false;
  };

  // const scanAndConnect = () => {
  //   console.log("scanAndConnect");
  //   manager.startDeviceScan(null, null, (error, device) => {
  //     if (error) {
  //       // Handle error (scanning will be stopped automatically)
  //       return;
  //     }

  //     console.log("Found", device.name, device.localName);
  //     manager.stopDeviceScan();
  //     // Check if it is a device you are looking for based on advertisement data
  //     // or other criteria.
  //     // if (device.name === 'TI BLE Sensor Tag' ||
  //     //     device.name === 'SensorTag') {

  //     //     // Stop scanning as it's not necessary if you are scanning for one device.
  //     //     manager.stopDeviceScan();

  //     //     // Proceed with connection.
  //     // }
  //   });
  // };
  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.error('Error during scanning:', error);
        return;
      }
      if (scannedDevice) {
        // Add the scanned device to the list
        setDevices((prevDevices) => {
          if (!prevDevices.find((d) => d.id === scannedDevice.id)) {
            return [...prevDevices, scannedDevice];
          }
          return prevDevices;
        });
      }
    });
  }

  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{`Name: ${item.name || 'Unknown'}`}</Text>
      <Text>{`ID: ${item.id}`}</Text>
      {/* You can add more information about the device */}
    </View>
  );
  const scanForDevice = async () => {
    const isPermissionsEnabled = await requestBluetoothPermission();
    if (isPermissionsEnabled) {
      console.log(isPermissionsEnabled);
      scanAndConnect();
    }
    else{
      console.log(isPermissionsEnabled);
    }
  };

const isBluetothOn = () => {
  const subscription = manager.onStateChange(state => {
    console.log(state);
    if (state === 'PoweredOn') {
      scanForDevice()
      subscription.remove()
    }
    else if (state === 'PoweredOff'){
      Alert.alert(
        'Bluetooth is Off',
        'Please turn on Bluetooth to use this feature.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to Bluetooth settings
              Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, true)
  return () => subscription.remove()
}
  return (
    <View style={styles.container}>
      <Text style={{padding: 10}}>React Native Bluetooth Example</Text>
      <Button size="small" onPress={() => isBluetothOn()}>
        Scan Device
      </Button>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <Text>No devices found</Text>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 100,
    height: 132,
    resizeMode: "stretch",
    paddingBottom: 20
  },
});

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <App />
  </ApplicationProvider>
);