import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type InsightCategory = 'all' | 'research' | 'announcements' | 'product-updates' | 'customer-story' | 'tutorials';

export interface InsightPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: InsightCategory;
  published: boolean;
  content: string;
}

const insightsDirectory = path.join(process.cwd(), 'content/insights');

export function getAllInsights(): InsightPost[] {
  // Check if directory exists
  if (!fs.existsSync(insightsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(insightsDirectory);
  const allInsights = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(insightsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        ...(data as Omit<InsightPost, 'slug' | 'content'>),
        content,
      };
    })
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allInsights;
}

export function getInsightBySlug(slug: string): InsightPost | undefined {
  const allInsights = getAllInsights();
  return allInsights.find(insight => insight.slug === slug);
}

export function getInsightsByCategory(category: InsightCategory): InsightPost[] {
  const allInsights = getAllInsights();
  if (category === 'all') return allInsights;
  return allInsights.filter(insight => insight.category === category);
}

export function getCategoryCount(category: InsightCategory): number {
  if (category === 'all') {
    return getAllInsights().length;
  }
  return getInsightsByCategory(category).length;
}

