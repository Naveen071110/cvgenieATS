
import { getAllPosts } from './posts';

export function generateRSSFeed(): string {
  const posts = getAllPosts().slice(0, 20); // Latest 20 posts
  const baseUrl = 'https://cvgenie.com';
  const feedUrl = `${baseUrl}/rss.xml`;
  const blogUrl = `${baseUrl}/blog`;
  
  const rssItems = posts.map(post => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const pubDate = new Date(post.date).toUTCString();
    
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>hello@cvgenie.com (${post.author})</author>
      ${post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}
    </item>`;
  }).join('\n');

  const latestPostDate = posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CVGenie Blog</title>
    <description>Expert career advice, resume tips, and job search strategies to help you land your dream job.</description>
    <link>${blogUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${latestPostDate}</lastBuildDate>
    <pubDate>${latestPostDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>CVGenie Blog</title>
      <link>${blogUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
${rssItems}
  </channel>
</rss>`;

  return rssFeed;
}
