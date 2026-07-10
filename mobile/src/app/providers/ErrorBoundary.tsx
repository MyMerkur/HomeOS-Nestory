import { Component, useMemo, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconAlertTriangle } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/Button';
import { fontSize, spacing, typography, type ThemeColors } from '../../theme/theme';
import { useTheme } from '../../theme/ThemeContext';
import { recordError } from '../../services/crashReporting';

type FallbackProps = { onRetry: () => void };

function ErrorFallback({ onRetry }: FallbackProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container} testID="error-boundary-fallback">
      <IconAlertTriangle color={colors.warning} size={48} />
      <Text style={styles.title}>{t('errorBoundary.title')}</Text>
      <Text style={styles.body}>{t('errorBoundary.body')}</Text>
      <Button testID="error-boundary-retry" label={t('errorBoundary.retryButton')} onPress={onRetry} variant="primary" />
    </View>
  );
}

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    recordError(error, `ErrorBoundary: ${errorInfo.componentStack ?? ''}`);
  }

  reset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.reset} />;
    }
    return this.props.children;
  }
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      gap: spacing.md,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: fontSize.displayMd,
      fontFamily: typography.heading.fontFamily,
      fontWeight: typography.heading.fontWeight,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    body: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}
