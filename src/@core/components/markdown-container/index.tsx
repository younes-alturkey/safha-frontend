import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { removeHttp } from 'src/@core/utils'

interface MarkdownRendererProps {
  children: any
}

export default function MarkdownRenderer(props: MarkdownRendererProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {removeHttp(props.children.replaceAll('```', ''))}
    </ReactMarkdown>
  )
}
