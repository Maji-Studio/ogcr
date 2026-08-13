// The numbered heading + spec table that opens every specimen section.

import type { SectionMeta } from './section-meta'

export function SectionHead({ meta }: { meta: SectionMeta }) {
  return (
    <>
      <div className="section__head">
        <div className="section__num">§{meta.num}</div>
        <div className="section__titles">
          <span className="section__kicker">{meta.kicker}</span>
          <h2 className="section__heading">
            {meta.title}
            {meta.tag && <span className="section__tag">{meta.tag}</span>}
          </h2>
          <p className="section__lede">{meta.lede}</p>
        </div>
      </div>
      {meta.spec && (
        <div className="section__spec">
          <div />
          <dl>
            <div>
              <dt>Figma node</dt>
              <dd>{meta.figmaNode}</dd>
            </div>
            {meta.spec.map((row) => (
              <div key={row.dt}>
                <dt>{row.dt}</dt>
                <dd>{row.dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  )
}
