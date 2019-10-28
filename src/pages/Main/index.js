import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Keyboard, ActivityIndicator} from 'react-native';

import PropTypes from 'prop-types';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  ButtonSubmit,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProileButtonText,
} from './styles';

export default class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    title: 'Usuários',
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
    errorUser: false,
  };

  async componentDidMount() {
    // AsyncStorage.setItem('users', '');

    const users = await AsyncStorage.getItem('users');
    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const {users, newUser} = this.state;

    this.setState({loading: true});

    try {
      if (newUser === '') throw new Error('Usuário Não Informado');

      const verification = users.find(user => {
        return user.login.toLowerCase() === newUser.toLowerCase();
      });

      if (verification) throw new Error('Usuário Duplicado');

      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        errorUser: false,
      });
    } catch (error) {
      this.setState({
        errorUser: true,
      });
    } finally {
      this.setState({
        newUser: '',
        loading: false,
      });
    }

    Keyboard.dismiss();
  };

  handleNavigation = user => {
    const {navigation} = this.props;

    navigation.navigate('User', {user});
  };

  render() {
    const {users, newUser, loading, errorUser} = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar Usuário"
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
            errorUser={errorUser}
          />

          <ButtonSubmit loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </ButtonSubmit>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.avatar}} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigation(item)}>
                <ProileButtonText>Ver perfil</ProileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
