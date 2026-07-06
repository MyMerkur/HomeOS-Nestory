import BarcodeScanning from '@react-native-ml-kit/barcode-scanning';
import { captureImage } from '../../../services/cameraCapture';

export async function scanBarcodeFromCamera(): Promise<string | null> {
  const uri = await captureImage();
  if (!uri) return null;

  const barcodes = await BarcodeScanning.scan(uri);
  return barcodes[0]?.value ?? null;
}
