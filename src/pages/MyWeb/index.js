/* eslint-disable camelcase */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';

export default class MyWeb extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('star').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    html_url: '',
  };

  componentDidMount() {
    const {navigation} = this.props;
    const star = navigation.getParam('star');

    const {html_url} = star;
    this.setState({html_url});
    console.log(navigation.getParam('star').name);
  }

  render() {
    const {html_url} = this.state;

    return <WebView source={{uri: html_url}} style={{marginTop: 20}} />;
  }
}
