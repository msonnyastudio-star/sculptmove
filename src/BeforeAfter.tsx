import { useEffect, useState } from 'react'
import { Icon } from './Icon'
import { useI18n } from './i18n'
import { Title } from './motion'

const IMAGES = ['/images/avant-apres-1.jpg', '/images/avant-apres-2.jpg', '/images/avant-apres-3.jpg', '/images/avant-apres-4.jpg']

export function BeforeAfter() {
  const { t } = useI18n()
  const copy = t.beforeAfter
  const [zoomed, setZoomed] = useState<number | null>(null)

  useEffect(() => {
    if (zoomed === null) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setZoomed(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomed])

  return <section className="before-after" id="avant-apres">
    <div className="before-after-head">
      <div className="eyebrow" data-reveal="up">{copy.eyebrow}</div>
      <Title lead={copy.title[0]} accent={copy.title[1]}/>
      <p data-reveal="up">{copy.text}</p>
    </div>
    <div className="before-after-grid">
      {IMAGES.map((src, index) => <button type="button" className="before-after-item" key={src} data-reveal="up" aria-label={copy.enlarge(index + 1)} onClick={() => setZoomed(index)}><img src={src} alt={copy.alt(index + 1)} loading="lazy"/></button>)}
    </div>
    <p className="before-after-note">{copy.note}</p>
    {zoomed !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={copy.alt(zoomed + 1)} onClick={() => setZoomed(null)}><button className="icon-button" aria-label={t.product.closeImage} onClick={() => setZoomed(null)}><Icon name="close"/></button><img src={IMAGES[zoomed]} alt={copy.alt(zoomed + 1)}/></div>}
  </section>
}
