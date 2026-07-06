// Sprint 1'de react-native-config ile ortam bazlı hale getirilecek.
export const API_BASE_URL = __DEV__
  ? 'http://localhost:5000/api'
  : 'https://api.homeos-nestory.com/api';
