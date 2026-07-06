import { Platform } from 'react-native';

// Sprint 1'de react-native-config ile ortam bazlı hale getirilecek.
// Android emulator kendi localhost'unu host makineden ayrı görür; 10.0.2.2 host'a yönlendirir.
// Gerçek cihazda test edilirken bu adres, Mac'in LAN IP'si ile değiştirilmelidir.
const DEV_API_PORT = 3030;
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:${DEV_API_PORT}/api`
  : 'https://api.homeos-nestory.com/api';
