export type IconName = 'bag' | 'arrow' | 'menu' | 'close' | 'plus' | 'minus' | 'trash' | 'whatsapp' | 'mail' | 'pin'

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const paths: Record<IconName, React.ReactNode> = {
    bag: <><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    arrow: <><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <path d="M5 12h14"/>,
    trash: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/></>,
    whatsapp: <><path d="M20.3 11.8a8.2 8.2 0 0 1-12.2 7.1l-4.1 1 1.1-4A8.2 8.2 0 1 1 20.3 11.8Z"/><path d="M9 8.5c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .6.5.8 1.1 1.4 1.9 1.9.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .4-.2 1.1-.6 1.5-.4.4-1 .7-1.7.7-.4 0-1.1-.1-2.2-.6-1-.5-2.1-1.3-3-2.3-.8-.9-1.3-1.9-1.5-2.6-.2-.8 0-1.5.4-2.1.2-.3.6-.7 1-.7Z"/></>,
    mail: <><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></>,
    pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}
