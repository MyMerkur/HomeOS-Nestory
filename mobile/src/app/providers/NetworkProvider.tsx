import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontSize, spacing, typography } from '../../theme/theme';

const NetworkContext = createContext<boolean>(true);

export function useIsConnected(): boolean {
  return useContext(NetworkContext);
}

export function NetworkProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected !== false);
    });
  }, []);

  return (
    <NetworkContext.Provider value={isConnected}>
      {children}
      {!isConnected ? (
        <View testID="offline-banner" style={[styles.banner, { paddingTop: insets.top + spacing.xs }]}>
          <Text style={styles.text}>{t('common.offlineBanner')}</Text>
        </View>
      ) : null}
    </NetworkContext.Provider>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#8C3323',
    paddingBottom: spacing.xs,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: fontSize.bodySm,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: typography.bodyMedium.fontWeight,
  },
});
