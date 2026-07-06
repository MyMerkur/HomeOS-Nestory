import { StyleSheet, Text, View } from 'react-native';

export function ShoppingPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Alışveriş listesi yakında burada olacak.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontSize: 14, color: '#666' },
});
