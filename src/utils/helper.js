export function profileImgPath(name) {
  const words = name.split(' ');
  let initials = '';

  for (const word of words) {
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(word)) {
      initials += word.charAt(0);
    } else {
      initials += word.charAt(0).toUpperCase();
    }
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle mb="20"  fill="#bab9b9"/>
      <text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        text-align='center'
        dominant-baseline="central"
        font-size="16" 
        fill="#495057"
        font-family="Arial, sans-serif"
        font-weight="bold"
      >${initials}</text>
  </svg>`;

  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

export function changeDateTimeZone(date) {
  return date
    .toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replaceAll('/', '-');
}

export function generatePeriods(startTime, endTime, fullFlg = false) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const start = new Date();
  start.setHours(startHour, startMin, 0, 0);
  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);
  if (!fullFlg) {
    end.setMinutes(end.getMinutes() - 30);
  }
  while (start <= end) {
    const minutes = start.getMinutes().toString().padStart(2, '0');
    const seconds = start.getSeconds().toString().padStart(2, '0');
    const hours = start.getHours().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}:${seconds}`);
    start.setMinutes(start.getMinutes() + 30);
  }
  return slots;
}

export function generateExtraPeriods(startTime, hours) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const start = new Date();
  start.setHours(startHour, startMin, 0, 0);
  start.setMinutes(start.getMinutes() + 30);
  const end = new Date(start.getTime() + (hours - 0.5) * 60 * 60 * 1000);
  while (start <= end) {
    const minutes = start.getMinutes().toString().padStart(2, '0');
    const seconds = start.getSeconds().toString().padStart(2, '0');
    const hours = start.getHours().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}:${seconds}`);
    start.setMinutes(start.getMinutes() + 30);
  }
  return slots;
}

export function format12Hour(timeStr) {
  const [hourStr, minute] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

export function fillPeriods(dateTaskGroups) {
  const filled = {};
  for (const date in dateTaskGroups) {
    const tasks = dateTaskGroups[date];
    const periodsOnly = tasks.map((t) => t.period);
    if (periodsOnly?.length > 0) {
      const sorted = periodsOnly.sort();
      const min = sorted?.[0];
      const max = sorted?.[sorted.length - 1];
      const fullPeriods = generatePeriods(min, max, true);
      filled[date] = fullPeriods.map((p) => {
        const match = tasks.find((t) => t.period === p);
        return match || { period: p };
      });
    }
  }
  return filled;
}
