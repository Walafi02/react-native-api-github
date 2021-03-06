import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvater,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
  };

  async componentDidMount() {
    this.setState({loading: true});
    this.loadStars();
    this.setState({loading: false});
  }

  loadStars = async (page = 1, stars = []) => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    // const {stars} = this.state;

    try {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page,
        },
      });
      this.setState({stars: [...stars, ...response.data], page});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  loadMore = async () => {
    const {page, stars} = this.state;
    const pageNumber = page + 1;
    this.loadStars(pageNumber, stars);
  };

  refreshList = () => {
    this.loadStars();
  };

  handleNavigation = star => {
    const {navigation} = this.props;
    navigation.navigate('MyWeb', {star});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading} = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#ccc" />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred onPress={() => this.handleNavigation(item)}>
                <OwnerAvater source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={false}
          />
        )}
      </Container>
    );
  }
}
