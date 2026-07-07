import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../ui/Button';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import type { HomeSetupScreenProps } from '../../../app/navigation/types';

export function HomeSetupChoiceScreen({ navigation }: HomeSetupScreenProps<'HomeSetupChoice'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Henüz bir evin yok</Text>
      <Text style={styles.subtitle}>Yeni bir ev oluştur ya da davet koduyla mevcut bir eve katıl.</Text>

      <View style={styles.actions}>
        <Button
          testID="go-to-create-home"
          label="Ev oluştur"
          onPress={() => navigation.navigate('CreateHome')}
        />
        <Button
          testID="go-to-join-home"
          label="Davet koduyla katıl"
          onPress={() => navigation.navigate('JoinHome')}
          variant="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
