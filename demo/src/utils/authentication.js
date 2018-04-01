import { AsyncStorage } from 'react-native';

const KEY = 'PLAYER_TOKEN';

let token;

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }

  token = (await AsyncStorage.getItem(KEY)) || null;
  return token;
};

export const signIn = newToken => {
  token = newToken;
  AsyncStorage.setItem(KEY, newToken);
  return token;
};

export const signOut = () => {
  token = null;
  AsyncStorage.removeItem(KEY);
  return token;
};
