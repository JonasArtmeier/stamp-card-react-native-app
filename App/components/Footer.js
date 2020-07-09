import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

//// function ////
const Footer = () => (
  <View style={FooterStyles.container}>
    <Text style={FooterStyles.text}>@Ask your employees</Text>
  </View>
);

//// style-components ////
const FooterStyles = StyleSheet.create({
  container: { flex: 1 },
  text: {
    position: 'absolute',
    fontFamily: 'sans-serif',
    fontWeight: '300',
    bottom: 0,
    right: 0,
  },
});

export default Footer;
