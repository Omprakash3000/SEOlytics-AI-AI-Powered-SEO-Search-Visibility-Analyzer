export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(dateString) {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
}

export function getScoreColor(score) {
  if (score >= 85) return 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
  if (score >= 70) return 'text-blue-400 border-blue-500 bg-blue-500/10';
  if (score >= 50) return 'text-amber-400 border-amber-500 bg-amber-500/10';
  return 'text-rose-400 border-rose-500 bg-rose-500/10';
}

export function getScoreBadge(score) {
  if (score >= 85) return { label: 'Excellent', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
  if (score >= 70) return { label: 'Good', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
  if (score >= 50) return { label: 'Needs Work', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
  return { label: 'Critical Issues', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
}
