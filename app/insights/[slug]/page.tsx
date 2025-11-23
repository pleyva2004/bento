import { getAllInsights, getInsightBySlug } from '@/lib/insights';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import InsightsLayout from '@/components/layout/InsightsLayout';

export async function generateStaticParams() {
    const insights = getAllInsights();
    return insights.map((post) => ({
        slug: post.slug,
    }));
}

export default function InsightPostPage({ params }: { params: { slug: string } }) {
    const post = getInsightBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <InsightsLayout>
            <main className="min-h-screen relative overflow-hidden pt-[10px] sm:pt-[124px] md:pt-[140px] ">
                <div className="max-w-7xl w-full mx-auto px-8 md:pl-24 lg:pl-32 lg:pr-16 pb-20 ">
                    {/* Navigation */}
                    <div className="mb-8 max-w-4xl mx-auto">
                        <Link
                            href="/insights"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-2"
                        >
                            <span>←</span> Back to The Signal
                        </Link>
                    </div>

                    {/* Article */}
                    <article className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-4 bg-white text-gray-900 border border-gray-300 rounded-2xl px-4 py-2">
                            <p className="text-xs sm:text-sm text-gray-500 mb-4">
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} · {post.author}
                            </p>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">{post.title}</h1>
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">{post.description}</p>
                        </div>

                        {/* Content */}
                        <div className="bg-white text-gray-900 border border-gray-300 rounded-2xl px-4 py-2 prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>

                        {/* Footer
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <Link
                                href="/insights"
                                className="text-blue-600 hover:underline inline-flex items-center gap-2 text-sm"
                            >
                                <span>←</span> Back to all insights
                            </Link>
                        </div> */}
                    </article>
                </div>
            </main>
        </InsightsLayout>
    );
}

