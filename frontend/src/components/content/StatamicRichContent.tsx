import React from 'react'

type ContentAttrs = {
  level?: number
}

type ContentBlock = {
  type?: string
  text?: string
  attrs?: ContentAttrs
  items?: Array<Array<{ type?: string; text?: string }>>
}

function renderInlineHtml(text?: string) {
  if (!text) return null

  return <span dangerouslySetInnerHTML={{ __html: text }} />
}

function renderListItems(items?: Array<Array<{ type?: string; text?: string }>>) {
  if (!items?.length) return null

  return items.map((item, index) => {
    const first = item?.[0]

    return (
      <li key={index}>
        {renderInlineHtml(first?.text)}
      </li>
    )
  })
}

export function extractContentHeadings(blocks?: ContentBlock[]) {
  if (!Array.isArray(blocks)) return []

  return blocks
    .filter((block) => block?.type === 'heading' && block?.text)
    .map((block, index) => ({
      id: `content-heading-${index}`,
      text: block.text || '',
      level: block.attrs?.level || 2,
    }))
}

export default function StatamicRichContent({
  blocks,
  className = '',
}: {
  blocks?: ContentBlock[]
  className?: string
}) {
  const headings = extractContentHeadings(blocks)
  let headingIndex = -1

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (!block?.type) return null

        if (block.type === 'heading') {
          headingIndex += 1
          const level = block.attrs?.level || 2
          const heading = headings[headingIndex]

          if (level === 3) {
            return (
              <h3 key={index} id={heading?.id} className="text-xl font-black text-[#0a1628] leading-[1.35] tracking-[0.01em] mb-3 mt-8">
                {block.text}
              </h3>
            )
          }

          return (
            <h2 key={index} id={heading?.id} className="text-2xl font-black text-[#0a1628] leading-[1.25] tracking-[0.01em] mb-4 mt-10 first:mt-0">
              {block.text}
            </h2>
          )
        }

        if (block.type === 'paragraph') {
          return (
            <p key={index} className="leading-relaxed text-gray-700">
              {renderInlineHtml(block.text)}
            </p>
          )
        }

        if (block.type === 'quote') {
          return (
            <blockquote key={index} className="border-l-4 border-[#dd222c] pl-5 italic text-gray-700 bg-gray-50 rounded-r-2xl py-3">
              {renderInlineHtml(block.text)}
            </blockquote>
          )
        }

        if (block.type === 'bullet_list') {
          return (
            <ul key={index} className="list-disc pl-6 space-y-2 text-gray-700">
              {renderListItems(block.items)}
            </ul>
          )
        }

        return block.text ? (
          <p key={index} className="leading-relaxed text-gray-700">
            {renderInlineHtml(block.text)}
          </p>
        ) : null
      })}
    </div>
  )
}
