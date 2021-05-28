import { CodeBlock as LibCodeBlock, dracula } from 'react-code-blocks'

interface CodeBlockProps {
  code: any;
}

export function CodeBlock ({ code }: CodeBlockProps) {
  const cleanCode = () => {
    let cleanerCode = JSON.stringify(code, null, 4)
    const matches = cleanerCode.match(/"[a-z_]+":/g)

    matches?.forEach(item => {
      const cleanItem = item.replace(/"/g, '')
      cleanerCode = cleanerCode.replace(item, cleanItem)
    })

    return cleanerCode
  }

  return (
    <LibCodeBlock
      text={cleanCode()}
      language='json'
      theme={dracula}
      showLineNumbers={false}
    />
  )
}
