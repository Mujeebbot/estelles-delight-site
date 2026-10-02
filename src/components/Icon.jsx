// Small stroke icon set so we never rely on emoji. 24x24, currentColor.
const P = {
  arrow:    <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  arrowUR:  <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  check:    <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus:     <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus:    <path d="M5 12h14" />,
  x:        <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  chevL:    <path d="m15 18-6-6 6-6" />,
  chevR:    <path d="m9 18 6-6-6-6" />,
  chevD:    <path d="m6 9 6 6 6-6" />,
  home:     <><path d="M4 11 12 4l8 7" /><path d="M6 10v9.5h4.5V14h3v5.5H18V10" /></>,
  bag:      <><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  mail:     <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  phone:    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4.5 6a2 2 0 0 1 2-2Z" />,
  pin:      <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  clock:    <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  users:    <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19c.5-3.2 3-5 6-5s5.5 1.8 6 5" /><path d="M16 5.6a3.2 3.2 0 0 1 0 5.8M18 14.4c1.8.6 2.8 2.2 3 4.6" /></>,
  truck:    <><path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  heart:    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />,
  leaf:     <><path d="M5 19c0-8 4.5-13 14-14 0 9.5-5 14-13 14" /><path d="M5 19c2-4 5-6.5 9-8" /></>,
  flame:    <path d="M12 21a6 6 0 0 0 6-6c0-3.5-2.5-5-3.5-8-1.8 1.2-3 3-3.3 5C9.8 11 9 10 9.2 8 7 9.8 6 12.5 6 15a6 6 0 0 0 6 6Z" />,
  star:     <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.5Z" />,
  sparkle:  <><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /><path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" /></>,
  send:     <><path d="M21 3 10 14" /><path d="m21 3-7 18-4-7-7-4 18-7Z" /></>,
  cookie:   <><path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5a3.5 3.5 0 0 0 4.5 4.5 3 3 0 0 0 4.5 4.5Z" /><circle cx="9" cy="10" r="1" /><circle cx="14" cy="15" r="1" /><circle cx="8.5" cy="15" r=".8" /></>,
  pie:      <><path d="M3.5 14.5c0-4 3.8-7 8.5-7s8.5 3 8.5 7z" /><path d="M3.5 14.5h17l-1.6 4.5H5.1z" /><path d="M8 11l1 2M12 10.5v2.5M16 11l-1 2" /></>,
  ball:     <><circle cx="9" cy="14" r="4.5" /><circle cx="16" cy="14.5" r="4" /><circle cx="12.5" cy="8.5" r="3.8" /></>,
  box:      <><path d="M3.5 8 12 4l8.5 4v9L12 21l-8.5-4V8Z" /><path d="m3.5 8 8.5 4 8.5-4M12 12v9" /></>,
  cup:      <><path d="M6 4h12l-1.4 16H7.4L6 4Z" /><path d="M6.4 9h11.2" /><path d="M13 4l2-2.5" /></>,
  grill:    <><path d="M5 14h14a7 7 0 0 1-14 0Z" /><path d="M9 4c0 2 1.5 2.5 1.5 4.5M14 4c0 2 1.5 2.5 1.5 4.5" /></>,
  chef:     <><path d="M7 14.5a3.8 3.8 0 0 1-.6-7.5A4.5 4.5 0 0 1 12 4a4.5 4.5 0 0 1 5.6 3 3.8 3.8 0 0 1-.6 7.5V19H7v-4.5Z" /><path d="M7 16.5h10" /></>,
  briefcase:<><rect x="3.5" y="7.5" width="17" height="12" rx="2" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 13h17" /></>,
  gift:     <><rect x="3.5" y="9" width="17" height="11" rx="1.5" /><path d="M2.5 9h19v-3h-19zM12 6v14" /><path d="M12 6C10 6 8 5 8 3.5S10.5 2 12 6c1.5-4 4-3.5 4-2.5S14 6 12 6Z" /></>,
  rings:    <><circle cx="9" cy="14.5" r="5" /><circle cx="15.5" cy="14.5" r="5" /><path d="M7.5 6.5 9 4l1.5 2.5L9 8.5Z" /></>,
  cake:     <><path d="M4 20h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7Z" /><path d="M4 15.5c2 1.5 3.5 1.5 4 0 .5 1.5 3.5 1.5 4 0 .5 1.5 3.5 1.5 4 0M12 11V8M12 8c-1 0-1.5-1-1.5-2S12 3.5 12 3.5s1.5 1.5 1.5 2.5S13 8 12 8Z" /></>,
  building: <><rect x="5" y="3.5" width="14" height="17" rx="1" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 20.5v-4h4v4" /></>,
  baby:     <><path d="M9.5 3h5v2.5h-5zM8.5 5.5h7V8l1 2v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-9l1-2V5.5Z" /><path d="M8 13h8" /></>,
  gem:      <><path d="m7 4-4 5.5L12 21l9-11.5L17 4H7Z" /><path d="M3 9.5h18M9.5 4 8 9.5 12 21l4-11.5L14.5 4" /></>,
  bell:     <><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17Z" /><path d="M10 21h4" /></>,
  instagram:<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" /></>,
  facebook: <path d="M14 8.5h3V5h-3a4 4 0 0 0-4 4v2H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V9.5a1 1 0 0 1 1-1Z" />,
  tiktok:   <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.5 2 4.2 4.5 4.5" />,
  whatsapp: <><path d="M4 20l1.2-4.2A8.5 8.5 0 1 1 8.3 19L4 20Z" /><path d="M9 8.5c.2 3 2.8 5.8 6 6.3l1-1.3-2-1-.8.8c-.8-.4-1.7-1.3-2.1-2.1l.8-.8-1-2L9 8.5Z" /></>,
}

export default function Icon({ name, size = 20, stroke = 1.8, className = '', ...rest }) {
  const body = P[name]
  if (!body) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
         className={`icon ${className}`} aria-hidden="true" focusable="false" {...rest}>
      {body}
    </svg>
  )
}
