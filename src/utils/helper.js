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
