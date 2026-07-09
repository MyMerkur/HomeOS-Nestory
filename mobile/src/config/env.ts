import { Platform } from 'react-native';

// Sprint 1'de react-native-config ile ortam bazlı hale getirilecek.
// Android emulator kendi localhost'unu host makineden ayrı görür; 10.0.2.2 host'a yönlendirir.
// iOS simulator host'un localhost'unu doğrudan paylaşır, ama gerçek iOS/Android cihazlar
// kendi localhost'una bakar (Mac'e değil) — bu yüzden LAN IP'si kullanılır.
// Mac'in ağı değiştiğinde (ör. farklı Wi-Fi) bu IP'nin güncellenmesi gerekir.
const DEV_API_PORT = 3030;
const DEV_LAN_IP = '192.168.1.105';
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : DEV_LAN_IP;

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:${DEV_API_PORT}/api`
  : 'https://api.homeos-nestory.com/api';
