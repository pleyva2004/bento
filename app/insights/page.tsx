import { getAllInsights, getInsightsByCategory, getCategoryCount, type InsightCategory } from '@/lib/insights';
import Link from 'next/link';
import InsightsLayout from '@/components/layout/InsightsLayout';

export default function InsightsPage({
    searchParams,
}: {
    searchParams: { category?: string };
}) {
    const category = (searchParams.category || 'all') as InsightCategory;
    const insights = category === 'all'
        ? getAllInsights()
        : getInsightsByCategory(category);

    const categories: { id: InsightCategory; label: string; count: number }[] = [
        { id: 'all', label: 'ALL', count: getCategoryCount('all') },
        { id: 'research', label: 'RESEARCH', count: getCategoryCount('research') },
        { id: 'announcements', label: 'ANNOUNCEMENTS', count: getCategoryCount('announcements') },
        { id: 'product-updates', label: 'PRODUCT UPDATES', count: getCategoryCount('product-updates') },
        { id: 'customer-story', label: 'CUSTOMER STORY', count: getCategoryCount('customer-story') },
        { id: 'tutorials', label: 'TUTORIALS', count: getCategoryCount('tutorials') },
    ];

    return (
        <InsightsLayout>
            <main className="min-h-[90vh] flex items-center justify-center relative overflow-hidden pt-20 sm:pt-[124px] md:pt-[140px]">
                {/* Top Centered Text */}
                <div className="absolute top-20 sm:top-[110px] md:top-[130px] left-0 right-0 text-center z-10 flex items-center justify-center h-10 sm:h-auto">
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-light tracking-widest uppercase text-balance">
                        [INSIGHTS]
                    </p>
                </div>

                <div className="relative max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] w-full mx-auto px-8 md:pl-24 lg:pl-32 xl:pl-20 2xl:pl-16 -mt-20 pb-20">
                    {/* Main Content */}
                    <div className="relative z-10 max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1200px] mx-auto">
                        {/* Main Heading */}
                        <div className="backdrop-blur-[1px] bg-white/5 rounded-3xl p-6 mb-8 text-center md:text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold leading-none tracking-tight">
                                THE SIGNAL
                            </h1>
                        </div>

                        {/* Category Filter */}
                        <nav className="flex flex-wrap gap-4 md:gap-8 mb-12 backdrop-blur-[1px] bg-white/5 rounded-3xl p-6">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/insights?category=${cat.id}`}
                                    className={
                                        category === cat.id
                                            ? 'border-2 border-black px-4 py-2 font-mono text-xs sm:text-sm whitespace-nowrap'
                                            : 'text-gray-400 uppercase text-xs sm:text-sm hover:text-gray-700 transition-colors whitespace-nowrap'
                                    }
                                >
                                    {category === cat.id ? `[ ${cat.label} -${cat.count}- ]` : cat.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Insight Posts */}
                        <div className="space-y-4">
                            {insights.length === 0 ? (
                                <div className="bg-white text-gray-900 border border-gray-300 rounded-2xl px-4 py-2">
                                    <p className="text-gray-500 text-center py-12">No posts found in this category.</p>
                                </div>
                            ) : (
                                insights.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/insights/${post.slug}`}
                                        className="block group"
                                    >
                                        <div className="bg-white text-gray-900 border border-gray-300 rounded-2xl px-4 py-2 hover:border-gray-400 transition-colors">
                                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-8 pb-4">
                                                {/* Left Column - Metadata */}
                                                <div className="text-gray-600 text-xs sm:text-sm space-y-1">
                                                    <p>{new Date(post.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</p>
                                                    <p>{post.author}</p>
                                                </div>

                                                {/* Right Column - Content */}
                                                <div>
                                                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 group-hover:underline">
                                                        {post.title}
                                                    </h2>
                                                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                                        {post.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </InsightsLayout>
    );
}

