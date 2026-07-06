import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { createHomeRequest, type HomeSummary } from '../services/homeApi';
import { HOMES_QUERY_KEY } from '../hooks/useHomesQuery';
import { createHomeSchema, type CreateHomeFormValues } from '../schemas/homeSchema';

export function CreateHomeScreen() {
  const queryClient = useQueryClient();
  const setSelectedHomeId = useHomeStore((state) => state.setSelectedHomeId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState<{ home: HomeSummary; inviteCode: string } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHomeFormValues>({
    resolver: zodResolver(createHomeSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: CreateHomeFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await createHomeRequest(values);
      setCreated(result);
    } catch {
      setServerError('Ev oluşturulamadı, tekrar dene.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (!created) return;
    queryClient.setQueryData<HomeSummary[]>(HOMES_QUERY_KEY, (existing) => [
      ...(existing ?? []),
      created.home,
    ]);
    setSelectedHomeId(created.home.id);
  };

  if (created) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ev oluşturuldu 🎉</Text>
        <Text style={styles.subtitle}>
          Aile üyelerini davet etmek için bu kodu paylaş. Bu kod yalnızca burada gösterilir.
        </Text>
        <Text testID="invite-code" style={styles.inviteCode}>
          {created.inviteCode}
        </Text>
        <Pressable testID="continue-button" style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Devam et</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ev oluştur</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Ev adı (ör. Ev, Yazlık)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
      {serverError && <Text style={styles.error}>{serverError}</Text>}

      <Pressable
        testID="create-home-submit"
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Oluştur</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#666' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: { color: '#c0392b', fontSize: 13 },
  inviteCode: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 4,
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#1d76db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
