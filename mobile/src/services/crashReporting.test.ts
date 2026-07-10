import crashlytics from '@react-native-firebase/crashlytics';
import { initCrashReporting, recordError, setCrashReportingUserId } from './crashReporting';

describe('crashReporting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets Crashlytics collection based on __DEV__', async () => {
    await initCrashReporting();

    expect(crashlytics().setCrashlyticsCollectionEnabled).toHaveBeenCalledWith(!__DEV__);
  });

  it('records Error instances as-is', () => {
    const error = new Error('boom');

    recordError(error);

    expect(crashlytics().recordError).toHaveBeenCalledWith(error);
  });

  it('wraps non-Error values in an Error before recording', () => {
    recordError('something went wrong');

    expect(crashlytics().recordError).toHaveBeenCalledWith(expect.any(Error));
    expect((crashlytics().recordError as jest.Mock).mock.calls[0][0].message).toBe(
      'something went wrong',
    );
  });

  it('logs the context breadcrumb before recording when provided', () => {
    const error = new Error('boom');

    recordError(error, 'ItemFormScreen.save');

    expect(crashlytics().log).toHaveBeenCalledWith('ItemFormScreen.save');
    expect(crashlytics().recordError).toHaveBeenCalledWith(error);
  });

  it('sets the Crashlytics user id', () => {
    setCrashReportingUserId('user-1');

    expect(crashlytics().setUserId).toHaveBeenCalledWith('user-1');
  });

  it('clears the Crashlytics user id on logout', () => {
    setCrashReportingUserId(null);

    expect(crashlytics().setUserId).toHaveBeenCalledWith('');
  });
});
