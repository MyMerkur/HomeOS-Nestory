import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { joinHomeRequest, type HomeSummary } from '../services/homeApi';
import { HOMES_QUERY_KEY } from '../hooks/useHomesQuery';
import { joinHomeSchema, type JoinHomeFormValues } from '../schemas/homeSchema';

export function JoinHomeScreen() {
  const queryClient = useQueryClient();
  const setSelectedHomeId = useHomeStore((state) => state.setSelectedHomeId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinHomeFormValues>({
    resolver: zodResolver(joinHomeSchema),
    defaultValues: { inviteCode: '' },
  });

  const onSubmit = async (values: JoinHomeFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const home = await joinHomeRequest(values);
      queryClient.setQueryData<HomeSummary[]>(HOMES_QUERY_KEY, (existing) => [
        ...(existing ?? []),
        home,
      ]);
      setSelectedHomeId(home.id);
    } catch {
      setServerError('Davet kodu geçersiz ya da bu eve zaten üyesin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Davet koduyla katıl</Text>

      <Controller
        control={control}
        name="inviteCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Davet kodu"
            autoCapitalize="characters"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.inviteCode && <Text style={styles.error}>{errors.inviteCode.message}</Text>}
      {serverError && <Text style={styles.error}>{serverError}</Text>}

      <Pressable
        testID="join-home-submit"
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Katıl</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: { color: '#c0392b', fontSize: 13 },
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
