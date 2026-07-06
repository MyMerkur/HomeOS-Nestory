import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HomeSetupScreenProps } from '../../../app/navigation/types';

export function HomeSetupChoiceScreen({ navigation }: HomeSetupScreenProps<'HomeSetupChoice'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Henüz bir evin yok</Text>
      <Text style={styles.subtitle}>Yeni bir ev oluştur ya da davet koduyla mevcut bir eve katıl.</Text>

      <Pressable
        testID="go-to-create-home"
        style={styles.button}
        onPress={() => navigation.navigate('CreateHome')}
      >
        <Text style={styles.buttonText}>Ev oluştur</Text>
      </Pressable>

      <Pressable
        testID="go-to-join-home"
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('JoinHome')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Davet koduyla katıl</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  button: {
    backgroundColor: '#1d76db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1d76db' },
  buttonText: { color: '#fff', fontWeight: '600' },
  secondaryButtonText: { color: '#1d76db' },
});
