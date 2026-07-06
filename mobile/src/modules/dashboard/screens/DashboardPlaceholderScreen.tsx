import { useQuery } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';
import { apiClient } from '../../../services/apiClient';

type HealthResponse = {
  success: boolean;
  data: { status: string; database: string };
};

async function fetchHealth() {
  const { data } = await apiClient.get<HealthResponse>('/health');
  return data;
}

export function DashboardPlaceholderScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeOS / Nestory</Text>
      <Text style={styles.subtitle}>Sprint 0 — backend bağlantı testi</Text>
      {isLoading && <Text>API kontrol ediliyor...</Text>}
      {isError && <Text style={styles.error}>API'ye ulaşılamadı (backend çalışıyor mu?)</Text>}
      {data && (
        <Text style={styles.status}>
          API: {data.data.status} · DB: {data.data.database}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#666' },
  status: { marginTop: 16, fontSize: 16 },
  error: { marginTop: 16, color: '#c0392b' },
});
