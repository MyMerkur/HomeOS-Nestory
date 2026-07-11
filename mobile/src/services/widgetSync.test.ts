import { NativeModules, Platform } from 'react-native';
import { syncWidgetData } from './widgetSync';
import { recordError } from './crashReporting';

jest.mock('./crashReporting', () => ({ recordError: jest.fn() }));

describe('syncWidgetData', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { get: () => originalOS });
    delete (NativeModules as Record<string, unknown>).NestoryWidget;
    jest.clearAllMocks();
  });

  it('writes a JSON snapshot to the native module when available', () => {
    const writeSnapshot = jest.fn();
    (NativeModules as Record<string, unknown>).NestoryWidget = { writeSnapshot };
    Object.defineProperty(Platform, 'OS', { get: () => 'android' });

    syncWidgetData({ expiringToday: 2, upcomingItems: [{ name: 'Süt' }, { name: 'Yoğurt' }] });

    expect(writeSnapshot).toHaveBeenCalledWith(
      JSON.stringify({ expiringToday: 2, upcomingItems: [{ name: 'Süt' }, { name: 'Yoğurt' }] }),
    );
  });

  it('truncates upcoming items to 3 in the snapshot', () => {
    const writeSnapshot = jest.fn();
    (NativeModules as Record<string, unknown>).NestoryWidget = { writeSnapshot };
    Object.defineProperty(Platform, 'OS', { get: () => 'android' });

    syncWidgetData({
      expiringToday: 0,
      upcomingItems: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
    });

    const payload = JSON.parse(writeSnapshot.mock.calls[0][0]);
    expect(payload.upcomingItems).toHaveLength(3);
  });

  it('does nothing when the native module is not linked', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'android' });

    expect(() => syncWidgetData({ expiringToday: 1, upcomingItems: [] })).not.toThrow();
  });

  it('does nothing on unsupported platforms', () => {
    const writeSnapshot = jest.fn();
    (NativeModules as Record<string, unknown>).NestoryWidget = { writeSnapshot };
    Object.defineProperty(Platform, 'OS', { get: () => 'web' });

    syncWidgetData({ expiringToday: 1, upcomingItems: [] });

    expect(writeSnapshot).not.toHaveBeenCalled();
  });

  it('reports an error via crashReporting when the native call throws', () => {
    const writeSnapshot = jest.fn(() => {
      throw new Error('native failure');
    });
    (NativeModules as Record<string, unknown>).NestoryWidget = { writeSnapshot };
    Object.defineProperty(Platform, 'OS', { get: () => 'android' });

    syncWidgetData({ expiringToday: 1, upcomingItems: [] });

    expect(recordError).toHaveBeenCalledWith(expect.any(Error), 'widgetSync.syncWidgetData');
  });
});
