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
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="#bab9b9"/>
      <text x="16" y="16"
        font-size="14" fill="#495057"
        x="16" y="16"
        text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>`;

  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}
