/*
Copyright 2021 Andrew Chen Wang

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

import React from 'react';
import {Image, StyleSheet, useColorScheme, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYWN3YW5ncHl0aG9uIiwiYSI6ImNrcjdlOGZ4YjIzZ24ybnJ6OWx0eHI4ZnoifQ.yq_cR-h1RDf0AnYVNVhMtA',
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245,252,255,0.6)',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSize: {
    height: 30,
    width: 30,
  },
});

const layerStyles = {
  smileyFace: {
    fillAntialias: true,
    fillColor: 'transparent',
  },
};

const districtsGeoJson =
  'https://raw.githubusercontent.com/Hear-Ye/find-your-district-and-representatives/main/districts.geojson';
// https://github.com/react-native-mapbox-gl/maps/blob/0e173c757c754ca6b3710fab88fe37b7b2014995/example/src/examples/PointInMapView.js
// https://github.com/react-native-mapbox-gl/maps/blob/0e173c757c754ca6b3710fab88fe37b7b2014995/example/src/examples/GeoJSONSource.js
export default () => {
  const isDarkMode = useColorScheme() === 'dark';
  const imageColor = {tintColor: isDarkMode ? 'white' : 'black'};
  const borderColor = isDarkMode ? 255 : 0;
  const borderLayerColor = {
    ...layerStyles.smileyFace,
    fillOutlineColor: `rgba(${borderColor}, ${borderColor}, ${borderColor}, 0.84)`,
  };

  const onUserMarkerPress = () => {
    console.log('You pressed on the user location annotation');
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          logoEnabled={false}
          styleURL={isDarkMode ? MapboxGL.StyleURL.Dark : null}>
          <MapboxGL.ShapeSource id="smileyFaceSource" url={districtsGeoJson}>
            <MapboxGL.FillLayer id="smileyFaceFill" style={borderLayerColor} />
          </MapboxGL.ShapeSource>
          <MapboxGL.Camera
            defaultSettings={{
              centerCoordinate: [-100, 37.6396365],
              zoomLevel: 2.5,
            }}
          />
          <MapboxGL.UserLocation visible={true} onPress={onUserMarkerPress} />
        </MapboxGL.MapView>
        <View style={styles.center} pointerEvents="box-none">
          <Image
            style={[styles.imageSize, imageColor]}
            source={require('./pin/pin.png')}
          />
        </View>
      </View>
    </View>
  );
};
