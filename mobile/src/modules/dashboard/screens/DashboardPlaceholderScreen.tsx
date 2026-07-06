import { useQuery } from '@tanstack/react-query';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { apiClient } from '../../../services/apiClient';
import type { MainStackScreenProps } from '../../../app/navigation/types';

type HealthResponse = {
  success: boolean;
  data: { status: string; database: string };
};

async function fetchHealth() {
  const { data } = await apiClient.get<HealthResponse>('/health');
  return data;
}

export function DashboardPlaceholderScreen({ navigation }: MainStackScreenProps<'Dashboard'>) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeOS / Nestory</Text>
      <Text style={styles.subtitle}>Sprint 2 — Pantry çekirdeği</Text>
      {isLoading && <Text>API kontrol ediliyor...</Text>}
      {isError && <Text style={styles.error}>API'ye ulaşılamadı (backend çalışıyor mu?)</Text>}
      {data && (
        <Text style={styles.status}>
          API: {data.data.status} · DB: {data.data.database}
        </Text>
      )}

      <Pressable
        testID="go-to-pantry"
        style={styles.button}
        onPress={() => navigation.navigate('Pantry')}
      >
        <Text style={styles.buttonText}>Dolabım</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#666' },
  status: { marginTop: 16, fontSize: 16 },
  error: { marginTop: 16, color: '#c0392b' },
  button: {
    marginTop: 24,
    backgroundColor: '#1d76db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
