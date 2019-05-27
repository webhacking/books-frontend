// temporary code
function pastelColors() {
  const r = (Math.round(Math.random() * 127) + 127).toString(16);
  const g = (Math.round(Math.random() * 127) + 127).toString(16);
  const b = (Math.round(Math.random() * 127) + 127).toString(16);
  return '#' + r + g + b;
}

export const quickMenuItems = [
  { color: pastelColors(), label: '신간', link: '/new-releases' },
  { color: pastelColors(), label: '베스트셀러', link: '/bestsellers' },
  { color: pastelColors(), label: '이벤트', link: '/event' },
  { color: pastelColors(), label: '소설 캘린더', link: '/event' },
  { color: pastelColors(), label: '만화 캘린더', link: '/event' },
  { color: pastelColors(), label: '기다리면 무료', link: '/wait-free' },
  { color: pastelColors(), label: '기다리면 무료', link: '/wait-free' },
  { color: pastelColors(), label: '선호 작품', link: '/serial-preference' },
  { color: pastelColors(), label: '제휴카드', link: '/support/partner-card' },
];
