export default function PageHeader({ icon, title, desc }) {
  return (
    <div className="card mb-5">
      <div className="section-head">
        <h1 className="text-sm font-semibold">{icon} {title}</h1>
      </div>
      {desc && (
        <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">{desc}</div>
      )}
    </div>
  )
}
