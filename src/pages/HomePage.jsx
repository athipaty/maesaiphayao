import { useHomeData } from '../hooks/useHomeData'
import { SECTION_COMPONENTS, buildSectionProps } from '../components/home/sections'
import { normalizeHomeOrder, normalizeHomeHidden } from '../config/homeSections'

// The public homepage. Renders whichever sections the admin has enabled, in
// whatever order they picked, via Admin → จัดหน้าแรก (AdminHomeBuilder) — that
// page edits the exact same 'homeSectionOrder' / 'homeSectionHidden' settings
// read here. See hooks/useHomeData.js for the data and components/home for
// the section components themselves.
export default function HomePage() {
  const data = useHomeData()
  const order  = normalizeHomeOrder(data.settings?.homeSectionOrder)
  const hidden = normalizeHomeHidden(data.settings?.homeSectionHidden)
  const sectionProps = buildSectionProps({ ...data, landingPhoto: data.settings?.landingPhoto || '' })

  return (
    <div>
      {order.filter(key => !hidden.includes(key)).map(key => {
        const Comp = SECTION_COMPONENTS[key]
        if (!Comp) return null
        return <Comp key={key} {...sectionProps[key]} />
      })}
    </div>
  )
}
