// export function parseTimestamp(timestamp) {
//   if (!timestamp) return { time: '', date: '' };

//   // Ensure it's a number
//   const ms = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
//   const dateObj = new Date(ms);

//   if (isNaN(dateObj.getTime())) {
//     console.warn('⚠️ Invalid timestamp:', timestamp);
//     return { time: '', date: '' };
//   }

//   // Format time (e.g. "2:58 PM")
//   const time = dateObj.toLocaleTimeString([], {
//     hour: 'numeric',
//     minute: '2-digit'
//   });

//   // Format date (e.g. "1/9/2025")
//   const date = dateObj.toLocaleDateString([], {
//     month: 'numeric',
//     day: 'numeric',
//     year: 'numeric'
//   });

//   return { time, date };
// }

export function parseTimestamp(timestamp) {
  if (!timestamp) return { time: '', date: '' };

  // Handle both ISO strings and epoch timestamps
  const dateObj =
    typeof timestamp === 'string' && isNaN(Number(timestamp))
      ? new Date(timestamp) // ISO string
      : new Date(Number(timestamp)); // number/string epoch

  if (isNaN(dateObj.getTime())) {
    console.warn('⚠️ Invalid timestamp:', timestamp);
    return { time: '', date: '' };
  }

  const now = new Date();

  // Format time (e.g., "2:58 PM")
  const time = dateObj.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

  // Strip times for comparison
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  // Today
  if (dateObj >= startOfToday) {
    return { time, date: 'Today' }; // WhatsApp shows only the time
  }

  // Yesterday
  if (dateObj >= startOfYesterday && dateObj < startOfToday) {
    return { time, date: 'Yesterday' };
  }

  // Same week (within last 7 days)
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(startOfToday.getDate() - 7);

  if (dateObj >= sevenDaysAgo) {
    // return date in format "7/9/2025"
    const formattedDate = dateObj.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return { time, date: formattedDate };
  }

  // Fallback → short date
  const date = dateObj.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return { time, date };
}
