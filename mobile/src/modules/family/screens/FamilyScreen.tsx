import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Alert, FlatList, Share, StyleSheet, Text, View } from 'react-native';
import { IconUsers } from '@tabler/icons-react-native';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { Chip } from '../../../ui/Chip';
import { EmptyState } from '../../../ui/EmptyState';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useHomeStore } from '../../../store/useHomeStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { MEMBERS_QUERY_KEY, useMembersQuery } from '../hooks/useMembersQuery';
import { regenerateInviteCode, removeMember, type Member } from '../services/familyApi';

const ROLE_LABELS: Record<Member['role'], string> = {
  owner: 'Sahip',
  admin: 'Yönetici',
  member: 'Üye',
  viewer: 'İzleyici',
};

function MemberRow({
  member,
  canManage,
  onRemove,
}: {
  member: Member;
  canManage: boolean;
  onRemove: () => void;
}) {
  return (
    <Card style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberEmail}>{member.email}</Text>
      </View>
      <View style={styles.memberActions}>
        <Chip label={ROLE_LABELS[member.role]} />
        {canManage && member.role !== 'owner' ? (
          <Button label="Çıkar" onPress={onRemove} variant="outline" />
        ) : null}
      </View>
    </Card>
  );
}

export function FamilyScreen() {
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const currentUserId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  const { data: members, isLoading, isError } = useMembersQuery();
  const [isInviting, setIsInviting] = useState(false);

  const currentMember = members?.find((member) => member.userId === currentUserId);
  const canManage = currentMember?.role === 'owner' || currentMember?.role === 'admin';

  const handleRemove = (member: Member) => {
    Alert.alert(`${member.name} çıkarılsın mı?`, undefined, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkar',
        style: 'destructive',
        onPress: async () => {
          await removeMember(homeId, member.userId);
          await queryClient.invalidateQueries({ queryKey: [MEMBERS_QUERY_KEY] });
        },
      },
    ]);
  };

  const handleInvite = async () => {
    setIsInviting(true);
    try {
      const inviteCode = await regenerateInviteCode(homeId);
      await Share.share({
        message: `HomeOS evine katılmak için davet kodu: ${inviteCode}`,
      });
    } finally {
      setIsInviting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || !members) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Üyeler yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inviteRow}>
        <Button
          label="Davet Et"
          onPress={handleInvite}
          loading={isInviting}
        />
      </View>

      {members.length === 0 ? (
        <EmptyState icon={IconUsers} title="Henüz üye yok" />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(member) => member.membershipId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MemberRow member={item} canManage={!!canManage} onRemove={() => handleRemove(item)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  error: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.body.fontFamily,
    color: colors.textSecondary,
  },
  inviteRow: { padding: spacing.lg },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  memberInfo: { flex: 1, gap: 2 },
  memberName: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: typography.bodyMedium.fontWeight,
    color: colors.textPrimary,
  },
  memberEmail: {
    fontSize: fontSize.bodySm,
    fontFamily: typography.caption.fontFamily,
    color: colors.textSecondary,
  },
  memberActions: { alignItems: 'flex-end', gap: spacing.xs },
});
