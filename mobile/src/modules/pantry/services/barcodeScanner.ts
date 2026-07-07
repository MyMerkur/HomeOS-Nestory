import BarcodeScanning from '@react-native-ml-kit/barcode-scanning';
import { captureImage } from '../../../services/cameraCapture';

export type BarcodeScanOutcome =
  | { status: 'found'; value: string }
  | { status: 'not-found' }
  | { status: 'cancelled' };

export async function scanBarcodeFromCamera(): Promise<BarcodeScanOutcome> {
  const uri = await captureImage();
  if (!uri) return { status: 'cancelled' };

  const barcodes = await BarcodeScanning.scan(uri);
  const value = barcodes[0]?.value;
  return value ? { status: 'found', value } : { status: 'not-found' };
}
