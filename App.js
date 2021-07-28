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

import React, {useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCenter: {
    top: -30, // adjust for pin
    left: 0,
    right: 0,
    bottom: 0,
  },
  locationCenter: {
    bottom: 44,
    left: 40,
  },
  imageSize: {
    height: 30,
    width: 30,
  },
  getLocationCenter: {
    bottom: 44,
    right: 40,
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
  const imageTintColor = isDarkMode ? 'white' : 'black';
  const imageColor = {tintColor: imageTintColor};
  const textColor = {color: imageTintColor};
  const borderColor = isDarkMode ? 255 : 0;
  const borderLayerColor = {
    ...layerStyles.smileyFace,
    fillOutlineColor: `rgba(${borderColor}, ${borderColor}, ${borderColor}, 0.84)`,
  };
  const [followUser, setFollowUser] = useState(false);
  const locationImageTintColor = {
    tintColor: followUser ? '#006ee6' : isDarkMode ? 'white' : 'black',
  };

  const mapRef = useRef();
  const cameraRef = useRef();

  const onUserMarkerUpdate = location => {
    if (followUser) {
      cameraRef.current.flyTo([
        location.coords.longitude,
        location.coords.latitude,
      ]);
    }
  };

  const followUserPress = () => {
    setFollowUser(_followUser => !_followUser);
  };

  const displayLocation = async () => {
    // center: [-100, 37.6396365];
    const center = await mapRef.current.getCenter();
    console.log('center: ', center);
    // getPointInView:  [195, 421.99999999999966]
    const point = await mapRef.current.getPointInView(center);
    console.log('getPointInView: ', point);
    // a {"features": [{"geometry": [Object], "properties":
    // [Object], "type": "Feature"}], "type": "FeatureCollection"}
    console.log(
      'a',
      await mapRef.current.queryRenderedFeaturesAtPoint(point, null, [
        'smileyFaceFill',
      ]),
    );
    // {"Code": "KS-01", "District": "Kansas 1st"}
    (
      await mapRef.current.queryRenderedFeaturesAtPoint(point, null, [
        'smileyFaceFill',
      ])
    ).features.forEach(x => console.log(x.properties));
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={mapRef}
          attributionPosition={{top: 14, left: 14}}
          style={styles.map}
          logoEnabled={false}
          styleURL={
            isDarkMode ? MapboxGL.StyleURL.Dark : MapboxGL.StyleURL.Street
          }>
          <MapboxGL.ShapeSource id="smileyFaceSource" url={districtsGeoJson}>
            <MapboxGL.FillLayer id="smileyFaceFill" style={borderLayerColor} />
          </MapboxGL.ShapeSource>
          <MapboxGL.Camera
            ref={cameraRef}
            defaultSettings={{
              centerCoordinate: [-100, 37.6396365],
              zoomLevel: 2.5,
            }}
          />
          <MapboxGL.UserLocation onUpdate={onUserMarkerUpdate} />
        </MapboxGL.MapView>
        <View
          style={[styles.center, styles.pinCenter]}
          pointerEvents="box-none">
          <Image
            style={[styles.imageSize, imageColor]}
            source={require('./pin/pin.png')}
          />
        </View>
        <View
          style={[styles.center, styles.locationCenter]}
          pointerEvents="box-none">
          <TouchableOpacity onPress={followUserPress}>
            <Image
              style={[styles.imageSize, locationImageTintColor]}
              source={require('./my-location/my-location.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[styles.center, styles.getLocationCenter]}
          pointerEvents="box-none">
          <TouchableOpacity onPress={displayLocation}>
            <Text style={textColor}>Get Location (view in console)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
