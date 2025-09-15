
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'content/posts');

function createSlugFromFilename(filename) {
  return filename
    .replace(/\.mdx?$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function checkContent() {
  if (!fs.existsSync(postsDirectory)) {
    console.error('❌ Posts directory not found:', postsDirectory);
    return;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const mdxFiles = fileNames.filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'));
  
  if (mdxFiles.length === 0) {
    console.log('⚠️  No MDX files found in content/posts');
    return;
  }

  console.log(`📝 Checking ${mdxFiles.length} MDX files...\n`);

  const slugs = new Set();
  const issues = [];
  const posts = [];

  mdxFiles.forEach(fileName => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    const post = {
      fileName,
      frontmatter: data,
      derivedSlug: createSlugFromFilename(fileName)
    };
    
    posts.push(post);

    // Check for required fields
    const slug = data.slug || post.derivedSlug;
    const title = data.title;
    const date = data.date;

    // Check for duplicate slugs
    if (slugs.has(slug)) {
      issues.push(`❌ Duplicate slug "${slug}" in ${fileName}`);
    } else {
      slugs.add(slug);
    }

    // Check for missing title
    if (!title) {
      issues.push(`⚠️  Missing title in ${fileName} (will use derived: "${fileName.replace(/\.mdx?$/, '').replace(/-/g, ' ')}")`);
    }

    // Check for missing date
    if (!date) {
      issues.push(`⚠️  Missing date in ${fileName}`);
    }

    // Check for missing description
    if (!data.description) {
      issues.push(`ℹ️  Missing description in ${fileName} (will use excerpt)`);
    }

    console.log(`✅ ${fileName}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Title: ${title || '(missing)'}`);
    console.log(`   Date: ${date || '(missing)'}`);
    console.log(`   Tags: [${(data.tags || []).join(', ')}]`);
    console.log('');
  });

  // Report issues
  if (issues.length > 0) {
    console.log('\n📋 Issues found:');
    issues.forEach(issue => console.log(issue));
  } else {
    console.log('\n✨ All content checks passed!');
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total posts: ${posts.length}`);
  console.log(`   Unique slugs: ${slugs.size}`);
  console.log(`   Issues: ${issues.length}`);
}

if (require.main === module) {
  checkContent();
}

module.exports = { checkContent };
