import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../ui/Button';
import { fontSize, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import type { HomeSetupScreenProps } from '../../../app/navigation/types';

export function HomeSetupChoiceScreen({ navigation }: HomeSetupScreenProps<'HomeSetupChoice'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('onboarding.choice.title')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.choice.subtitle')}</Text>

      <View style={styles.actions}>
        <Button
          testID="go-to-create-home"
          label={t('onboarding.choice.createButton')}
          onPress={() => navigation.navigate('CreateHome')}
        />
        <Button
          testID="go-to-join-home"
          label={t('onboarding.choice.joinButton')}
          onPress={() => navigation.navigate('JoinHome')}
          variant="outline"
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
    title: {
      fontSize: fontSize.displayLg,
      fontFamily: typography.display.fontFamily,
      fontWeight: typography.display.fontWeight,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      marginBottom: spacing.xxl,
    },
    actions: { gap: spacing.md },
  });
}
