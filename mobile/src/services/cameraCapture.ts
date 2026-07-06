import { launchCamera } from 'react-native-image-picker';

export async function captureImage(): Promise<string | null> {
  const result = await launchCamera({ mediaType: 'photo', saveToPhotos: false });

  if (result.didCancel || result.errorCode || !result.assets?.[0]?.uri) {
    return null;
  }

  return result.assets[0].uri;
}
