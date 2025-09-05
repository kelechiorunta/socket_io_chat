export function parseTimestamp(timestamp) {
  if (!timestamp) return { time: '', date: '' };

  // Ensure it's a number
  const ms = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
  const dateObj = new Date(ms);

  if (isNaN(dateObj.getTime())) {
    console.warn('⚠️ Invalid timestamp:', timestamp);
    return { time: '', date: '' };
  }

  // Format time (e.g. "2:58 PM")
  const time = dateObj.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

  // Format date (e.g. "1/9/2025")
  const date = dateObj.toLocaleDateString([], {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  return { time, date };
}
