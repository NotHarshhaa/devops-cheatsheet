import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { getCheatsheetBySlug } from '@/utils/markdown';
import CopyButton from '@/components/CopyButton';

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cheatsheet = await getCheatsheetBySlug(params.category, params.slug);
  if (!cheatsheet) return {};

  return {
    title: `${cheatsheet.title} | DevOps Cheatsheet`,
    description: cheatsheet.description,
  };
}

export default async function CheatsheetPage({ params }: Props) {
  const cheatsheet = await getCheatsheetBySlug(params.category, params.slug);
  
  if (!cheatsheet) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{cheatsheet.icon}</span>
          <h1 className="text-4xl font-bold text-gray-900">
            {cheatsheet.title}
          </h1>
        </div>
        <p className="text-lg text-gray-500">
          {cheatsheet.description}
        </p>
      </header>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { className, children } = props;
              const match = /language-(\w+)/.exec(className || '');
              const code = String(children).replace(/\n$/, '');

              if (!match) {
                return <code {...props} />;
              }

              return (
                <div className="relative group">
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.375rem',
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={code} />
                  </div>
                </div>
              );
            },
          }}
        >
          {cheatsheet.content}
        </ReactMarkdown>
      </div>
    </article>
  );
} 