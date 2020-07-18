import React from 'react';
import { StyleSheet, View } from 'react-native';

//// style-components ////
const spacerStyles = StyleSheet.create({ spacer: { height: 50, width: 50 } });

//// function ////
const Spacer = (props) => <View style={spacerStyles.spacer} />;

export default Spacer;
