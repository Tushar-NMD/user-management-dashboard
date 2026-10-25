/**
 * Date, size, and text formatting helpers
 */

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getUserInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Returns deterministic subtle background/text pair based on string hash
 */
export function getAvatarColor(name: string): { bg: string; text: string; border: string } {
  const hues = [
    { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' }, // indigo
    { bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' }, // teal
    { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' }, // emerald
    { bg: '#FDF4FF', text: '#A21CAF', border: '#F5D0FE' }, // fuchsia
    { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' }, // orange
    { bg: '#F8FAFC', text: '#334155', border: '#CBD5E1' }, // slate
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % hues.length;
  return hues[index];
}
