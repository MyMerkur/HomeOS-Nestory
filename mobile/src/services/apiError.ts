import i18next from '../i18n';

function getServerErrorCode(err: unknown): string | undefined {
  return (err as { response?: { data?: { error?: { code?: string } } } })?.response?.data?.error
    ?.code;
}

export function getErrorMessage(err: unknown): string {
  const code = getServerErrorCode(err);
  if (code && i18next.exists(`errors.${code}`)) {
    return i18next.t(`errors.${code}`);
  }
  return i18next.t('errors.generic');
}
