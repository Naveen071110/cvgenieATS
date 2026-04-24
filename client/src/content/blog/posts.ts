export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-ats-works-and-why-it-matters",
    title: "How ATS Works — And Why Your Resume Keeps Getting Rejected",
    date: "2026-04-10",
    excerpt:
      "Over 98% of Fortune 500 companies use Applicant Tracking Systems to filter resumes before a human ever sees them. Here's exactly how ATS works and what you can do about it.",
    tags: ["ATS", "Resume Tips", "Job Search"],
    readingTime: 6,
    content: `
<h2>What Is an Applicant Tracking System?</h2>
<p>An Applicant Tracking System (ATS) is software that companies use to collect, sort, and rank job applications. When you submit a resume online, it almost never goes directly to a recruiter's inbox — it first passes through an ATS that scans your resume for keywords, formats, and other signals to decide whether you're worth a human's time.</p>
<p>According to Jobscan, over 98% of Fortune 500 companies use ATS software. If you've applied for jobs at larger companies and heard nothing back, an ATS filter is likely the culprit — not a lack of qualifications.</p>

<h2>How ATS Scores Your Resume</h2>
<p>ATS systems parse your resume and evaluate it on several criteria:</p>
<ul>
  <li><strong>Keyword match:</strong> Does your resume contain the specific skills and phrases from the job description?</li>
  <li><strong>Formatting compatibility:</strong> Can the system extract text cleanly, or is it tripped up by tables, columns, headers, or unusual fonts?</li>
  <li><strong>Section recognition:</strong> Does the ATS correctly identify your Work Experience, Education, and Skills sections?</li>
  <li><strong>Relevance signals:</strong> Are your job titles and responsibilities aligned with what the role demands?</li>
</ul>

<h2>The Keyword Problem</h2>
<p>The most common reason resumes fail ATS screening is keyword mismatch. Job descriptions are full of specific phrases — "cross-functional collaboration," "Agile methodology," "revenue growth" — and if your resume doesn't echo those exact terms, the ATS will score you lower, regardless of your actual experience.</p>
<p>This is especially tricky because the same skill can be described in dozens of ways. You might write "team player" while the job description says "collaborative contributor." Semantically identical — but an ATS doesn't know that.</p>

<h2>Formatting Mistakes That Kill Your ATS Score</h2>
<p>Even a perfectly written resume can fail ATS if it's formatted poorly. The biggest culprits:</p>
<ul>
  <li><strong>Tables and columns:</strong> Most ATS systems read left-to-right, top-to-bottom. Tables get scrambled.</li>
  <li><strong>Headers and footers:</strong> Content in the page header or footer is often ignored entirely.</li>
  <li><strong>Images and graphics:</strong> ATS cannot read text embedded in images or infographic-style resumes.</li>
  <li><strong>Unusual fonts or special characters:</strong> Stick to standard fonts like Arial, Calibri, or Times New Roman.</li>
  <li><strong>Creative file formats:</strong> Always submit as PDF or .docx unless the job posting specifies otherwise.</li>
</ul>

<h2>How to Beat the ATS</h2>
<p>The good news: beating ATS isn't about gaming the system — it's about clarity and relevance.</p>
<ol>
  <li><strong>Mirror the job description:</strong> Read it carefully and incorporate the exact keywords it uses, especially in your skills section and bullet points.</li>
  <li><strong>Use a clean, single-column format:</strong> Avoid tables, text boxes, and graphics. Simple, linear layouts parse best.</li>
  <li><strong>Label your sections clearly:</strong> Use standard headings like "Work Experience," "Education," and "Skills."</li>
  <li><strong>Quantify your achievements:</strong> Numbers — percentages, dollar amounts, timeframes — signal concrete impact and often match recruiter search filters.</li>
  <li><strong>Tailor each application:</strong> A generic resume will always score lower than one tailored to the specific role.</li>
</ol>

<h2>Final Thought</h2>
<p>The ATS isn't your enemy — it's a filter you can learn to pass. Once you understand how it scores resumes, you can write one that sails through to the human review stage, which is where your real qualifications finally get to shine.</p>
<p>CVGenie's AI generator is built specifically to produce ATS-optimized resumes by analyzing your target job description and matching your experience to what each role actually asks for.</p>
    `.trim(),
  },
  {
    slug: "resume-bullet-points-that-get-interviews",
    title: "Resume Bullet Points That Actually Get Interviews",
    date: "2026-04-03",
    excerpt:
      "Most bullet points on resumes are vague, passive, and forgettable. Here's a simple formula for writing bullets that catch a recruiter's eye — and an ATS algorithm's score.",
    tags: ["Resume Tips", "Writing", "Career Advice"],
    readingTime: 5,
    content: `
<h2>Why Most Resume Bullets Fall Flat</h2>
<p>Open any resume and you'll see bullets like these:</p>
<ul>
  <li>Responsible for managing a team</li>
  <li>Helped with marketing campaigns</li>
  <li>Worked on product development</li>
</ul>
<p>These bullets tell a recruiter almost nothing. They're vague, passive, and interchangeable with anyone else who's ever held a similar role. They don't quantify impact, don't signal ownership, and don't differentiate you from the other 200 applicants.</p>

<h2>The Formula: Action + Scope + Result</h2>
<p>Strong resume bullets follow a consistent pattern:</p>
<blockquote>
  <strong>[Strong Action Verb] + [What You Did / Scope] + [Measurable Result]</strong>
</blockquote>
<p>Here's the same three bullets rewritten:</p>
<ul>
  <li><em>Before:</em> Responsible for managing a team → <strong>Led a 7-person engineering team through a 6-month product relaunch, delivering on schedule and under budget by 12%</strong></li>
  <li><em>Before:</em> Helped with marketing campaigns → <strong>Contributed copy and A/B testing strategy to 4 email campaigns that drove a 34% increase in click-through rate</strong></li>
  <li><em>Before:</em> Worked on product development → <strong>Co-designed and shipped 3 new features in an Agile sprint cycle, reducing customer-reported bugs by 41%</strong></li>
</ul>

<h2>Choosing the Right Action Verbs</h2>
<p>Your opening verb sets the tone for the entire bullet. Avoid weak verbs like "helped," "worked on," "assisted with," or "participated in." These signal a passive role.</p>
<p>Instead, choose verbs that signal ownership and initiative:</p>
<ul>
  <li><strong>For leadership roles:</strong> Led, Directed, Managed, Oversaw, Mentored, Built</li>
  <li><strong>For technical roles:</strong> Engineered, Architected, Deployed, Automated, Optimized</li>
  <li><strong>For data/analysis roles:</strong> Analyzed, Modeled, Forecasted, Identified, Evaluated</li>
  <li><strong>For marketing/sales roles:</strong> Launched, Grew, Drove, Acquired, Converted</li>
  <li><strong>For operations roles:</strong> Streamlined, Reduced, Improved, Scaled, Standardized</li>
</ul>

<h2>When You Don't Have Numbers</h2>
<p>One of the most common objections to quantified bullets is: "I don't have exact numbers." That's fine — estimates and relative comparisons still work.</p>
<ul>
  <li>"Reduced manual reporting time by roughly 50% through spreadsheet automation"</li>
  <li>"Managed vendor relationships across 5+ active contracts"</li>
  <li>"Supported a team of 12 across 3 regional offices"</li>
</ul>
<p>The goal is specificity, not precision. Even a rough number is better than no number at all.</p>

<h2>How Many Bullets Per Role?</h2>
<p>A good rule of thumb:</p>
<ul>
  <li><strong>Current or most recent role:</strong> 4–6 bullets</li>
  <li><strong>Previous roles:</strong> 2–4 bullets</li>
  <li><strong>Older or less relevant roles:</strong> 1–2 bullets, or omit entirely</li>
</ul>
<p>Quality beats quantity. Three excellent bullets will outperform seven mediocre ones every time.</p>

<h2>The Takeaway</h2>
<p>Great resume bullets aren't about creativity — they're about clarity and evidence. When a recruiter can see exactly what you did, how big it was, and what changed because of your work, they have everything they need to move you to the next round.</p>
    `.trim(),
  },
  {
    slug: "cover-letter-that-gets-read",
    title: "How to Write a Cover Letter That Actually Gets Read",
    date: "2026-03-25",
    excerpt:
      "Most cover letters are ignored because they repeat the resume. Here's how to write one that adds genuine value — and makes the hiring manager want to meet you.",
    tags: ["Cover Letter", "Job Search", "Writing"],
    readingTime: 5,
    content: `
<h2>The Cover Letter Paradox</h2>
<p>Hiring managers say cover letters matter. They also say most cover letters are a waste of time. Both things are true — because most cover letters are just resumes in prose form, rehashing the same information in paragraph format without adding any new signal.</p>
<p>A cover letter that works does something different: it answers the question a resume can't. Why you? Why this company? Why now?</p>

<h2>The Opening: Don't Waste It</h2>
<p>The first two sentences of a cover letter are the most important. Most people waste them with filler:</p>
<blockquote>"I am writing to express my interest in the Marketing Manager position at Acme Corp, which I found on LinkedIn."</blockquote>
<p>This tells the recruiter nothing they don't already know. Instead, lead with something that earns attention:</p>
<blockquote>"I've spent the last three years building and scaling content programs from zero to 200K monthly readers — and I'd like to bring that playbook to Acme's next growth phase."</blockquote>
<p>This opener establishes credibility immediately and signals exactly what value you bring.</p>

<h2>The Middle: Make the Connection Explicit</h2>
<p>Your cover letter's body should do one thing: connect your specific experience to the company's specific need. The best way to do this is to read the job description carefully and identify the 2–3 most critical requirements — then provide a brief, concrete story for each one.</p>
<p>Structure each paragraph around a problem the role will face and evidence that you've solved it before. This is far more persuasive than a list of adjectives about how "passionate" or "dedicated" you are.</p>

<h2>The Closing: Ask for Something</h2>
<p>End with a clear, confident ask — not an apologetic hedge. Instead of "I hope to hear from you," try:</p>
<blockquote>"I'd love to connect for 20 minutes to discuss how my experience with B2B content strategy could fit what you're building. Happy to share examples of my past work."</blockquote>
<p>This shows confidence, specificity, and forward momentum.</p>

<h2>Four Cover Letter Rules to Live By</h2>
<ol>
  <li><strong>Keep it under 300 words.</strong> Long cover letters almost never get read in full.</li>
  <li><strong>Address it to a person, not "To Whom It May Concern."</strong> Spend 2 minutes on LinkedIn to find the hiring manager's name.</li>
  <li><strong>Customize it every time.</strong> A generic cover letter signals you're not serious about the role.</li>
  <li><strong>Don't repeat your resume.</strong> The cover letter's job is to add context and personality — not summarize what's already on the page.</li>
</ol>

<h2>What About AI-Generated Cover Letters?</h2>
<p>AI tools can give you a strong first draft — especially when you're applying to many roles and need to iterate quickly. The key is treating the AI output as a starting point, not a final product. Review it for accuracy, add a personal detail or two, and make sure the voice sounds like you.</p>
<p>CVGenie's cover letter generator is built to match your specific resume content to the job description, so the output is tailored rather than generic — but it always benefits from a human read-through before sending.</p>
    `.trim(),
  },
  {
    slug: "ats-resume-formatting-guide",
    title: "The Complete ATS Resume Formatting Guide for 2026",
    date: "2026-03-15",
    excerpt:
      "Your resume content might be excellent, but the wrong formatting can stop it from ever reaching human eyes. This guide covers every formatting rule that matters for ATS compliance in 2026.",
    tags: ["ATS", "Resume Tips", "Formatting"],
    readingTime: 7,
    content: `
<h2>Why Formatting Matters as Much as Content</h2>
<p>A beautifully designed resume with infographics, skill bars, and two-column layouts might look impressive to the human eye — but it's a disaster for ATS. Most ATS systems parse resumes linearly, and any non-standard formatting causes parsing errors that garble your experience and drop your score.</p>
<p>The golden rule: your resume should be optimized for a robot first, a human second.</p>

<h2>File Format: PDF vs. DOCX</h2>
<p>Both PDF and .docx files are generally safe in 2026 — most modern ATS platforms handle both well. However:</p>
<ul>
  <li>If the job posting specifies a format, use that format.</li>
  <li>If no format is specified, PDF is typically the safer choice because it preserves your layout across systems.</li>
  <li>Never submit a .pages, .odt, or image file (JPG, PNG) unless explicitly asked — these often fail to parse.</li>
</ul>

<h2>Layout: Single Column is King</h2>
<p>Two-column layouts are popular in resume templates — and they're one of the biggest ATS killers. When an ATS reads across columns, it mixes content from both sides together, creating nonsensical output. A single-column layout ensures your content is read in the correct order.</p>
<p>Avoid:</p>
<ul>
  <li>Side-by-side columns for skills or contact info</li>
  <li>Text boxes (content inside them is often ignored)</li>
  <li>Tables (cells get scrambled in parsing)</li>
  <li>Headers and footers (often skipped entirely)</li>
</ul>

<h2>Fonts and Styling</h2>
<p>Stick to standard, widely supported fonts. Safe choices include:</p>
<ul>
  <li>Arial, Calibri, Helvetica (modern sans-serif)</li>
  <li>Times New Roman, Georgia (classic serif)</li>
  <li>Garamond, Cambria (elegant alternatives)</li>
</ul>
<p>Font size should be 10–12pt for body text and 14–16pt for your name/headings. Avoid decorative or display fonts — they risk being replaced with garbled characters in some ATS systems.</p>

<h2>Section Headers: Use Standard Labels</h2>
<p>ATS systems look for standard section labels to categorize your content. Clever or creative section names can confuse the parser.</p>
<p>Use these standard headings:</p>
<ul>
  <li>Work Experience (not "My Career Journey" or "What I've Done")</li>
  <li>Education (not "Academic Background")</li>
  <li>Skills (not "My Toolbox")</li>
  <li>Certifications (not "Credentials")</li>
  <li>Summary or Professional Summary (not "About Me")</li>
</ul>

<h2>The Skills Section: Do It Right</h2>
<p>Your skills section is one of the primary targets for ATS keyword matching. Here's how to make it count:</p>
<ul>
  <li>List hard skills explicitly — software names, programming languages, methodologies, certifications</li>
  <li>Don't include soft skills like "communication" or "teamwork" — these don't match ATS filters</li>
  <li>Use the exact terminology from the job description (e.g., "Google Analytics 4" not just "analytics tools")</li>
  <li>Keep it as a simple comma-separated or bulleted list — no ratings or skill bars</li>
</ul>

<h2>Contact Information Placement</h2>
<p>Place all contact information in the main body of the document, not in a header or footer. Include:</p>
<ul>
  <li>Full name</li>
  <li>Phone number</li>
  <li>Professional email</li>
  <li>LinkedIn URL</li>
  <li>City and state (full address is no longer standard or necessary)</li>
</ul>

<h2>Length: One Page vs. Two Pages</h2>
<p>The old "one page only" rule is outdated for experienced candidates. Current guidance:</p>
<ul>
  <li><strong>0–5 years of experience:</strong> 1 page</li>
  <li><strong>5–10 years of experience:</strong> 1–2 pages</li>
  <li><strong>10+ years of experience:</strong> 2 pages maximum</li>
</ul>
<p>Never force a two-page resume to fit on one by shrinking margins or font size below readability. White space is your friend — it makes the document easier to scan.</p>

<h2>Quick ATS Formatting Checklist</h2>
<ul>
  <li>Single-column layout</li>
  <li>Standard fonts, 10–12pt body text</li>
  <li>Standard section headers</li>
  <li>No tables, text boxes, or columns</li>
  <li>Contact info in the main body (not headers/footers)</li>
  <li>PDF or .docx file format</li>
  <li>Consistent date formatting (e.g., Jan 2023 – Present)</li>
  <li>No images, logos, or graphics</li>
</ul>
    `.trim(),
  },
  {
    slug: "tailoring-resume-for-every-job",
    title: "Why You Should Tailor Your Resume for Every Job (And How to Do It Fast)",
    date: "2026-03-05",
    excerpt:
      "Sending the same resume to 50 jobs is one of the most common — and costly — job search mistakes. Here's why tailoring matters and how to do it in under 15 minutes per application.",
    tags: ["Resume Tips", "Job Search", "ATS"],
    readingTime: 6,
    content: `
<h2>The Generic Resume Problem</h2>
<p>Most job seekers have one version of their resume that they send to every application. It makes sense — tailoring feels time-consuming, and a good resume should speak for itself, right?</p>
<p>Wrong. Studies consistently show that tailored resumes get 2–3x more callbacks than generic ones. And with AI tools available today, tailoring no longer requires hours of manual rewriting.</p>

<h2>Why Tailoring Works: The ATS Reason</h2>
<p>The most concrete reason to tailor your resume is ATS scoring. When an ATS compares your resume against a job description, it's looking for keyword overlap. The higher the overlap, the higher your score — and the more likely a recruiter sees your application.</p>
<p>Different job descriptions for the same role category can use completely different terminology. "Project manager" resumes at one company might need to mention "Agile" and "JIRA," while another wants "waterfall methodology" and "MS Project." The same experience, but the keywords are different — and ATS doesn't guess.</p>

<h2>Why Tailoring Works: The Human Reason</h2>
<p>Even if your resume passes ATS, a recruiter spending 6–10 seconds scanning it still needs to immediately see the match. A tailored resume puts the most relevant experience and skills at the top, uses the same language as the role, and feels like it was written specifically for the job — because it was.</p>
<p>Generic resumes feel generic. They signal that you're casting a wide net, not genuinely interested in this specific role. In competitive hiring, that perception matters.</p>

<h2>The Fastest Way to Tailor: A 4-Step Process</h2>
<ol>
  <li>
    <strong>Extract the key requirements.</strong> Read the job description and highlight 5–8 must-have skills, qualifications, or experiences. These are the things mentioned first, mentioned multiple times, or listed under "required" vs. "preferred."
  </li>
  <li>
    <strong>Check your resume for matches.</strong> Where does your experience already cover these requirements? Make sure those matches are explicit and easy to spot — not buried in bullet point five of an old role.
  </li>
  <li>
    <strong>Mirror the language.</strong> Where you use different terminology for the same concept, swap yours for theirs. This is not dishonest — it's making sure your real experience gets recognized.
  </li>
  <li>
    <strong>Adjust your summary.</strong> Your professional summary (the 2–3 lines at the top of your resume) should briefly mention the role title and reflect the 2–3 top priorities of the specific position. This takes 2 minutes and makes an immediate impression.
  </li>
</ol>

<h2>What Not to Change</h2>
<p>Tailoring means adjusting emphasis and language — not fabricating experience. Never add skills you don't have, inflate job titles, or misrepresent your background. ATS might not catch it, but a 5-minute phone screen with a recruiter will.</p>

<h2>Using AI to Speed Up Tailoring</h2>
<p>Tools like CVGenie are designed exactly for this use case. You paste in your existing resume and the job description, and the AI analyzes the keyword gap, mirrors the job description's language, and adjusts the emphasis of your bullet points — all while keeping your actual experience accurate.</p>
<p>The result is a resume that looks hand-crafted for the role, produced in the time it used to take to update a date field.</p>

<h2>The Bottom Line</h2>
<p>Sending 50 generic applications is less effective than sending 20 tailored ones. Quality beats quantity in the job search, and tailoring is the single highest-leverage change most job seekers can make to their application strategy.</p>
    `.trim(),
  },
  {
    slug: "linkedin-profile-optimization-guide",
    title: "How to Optimize Your LinkedIn Profile to Attract Recruiters",
    date: "2026-02-24",
    excerpt:
      "Your LinkedIn profile is often the first thing a recruiter sees — even before your resume. Here's a step-by-step guide to making it work harder for your job search.",
    tags: ["LinkedIn", "Job Search", "Career Advice"],
    readingTime: 6,
    content: `
<h2>Why LinkedIn Profile Optimization Matters</h2>
<p>Recruiters don't wait for you to apply to their jobs — they actively search LinkedIn for candidates. If your profile isn't optimized, you're invisible to the recruiters who could hand you an interview without you ever submitting an application.</p>
<p>LinkedIn has its own internal search algorithm, and like Google, it ranks profiles based on keyword relevance, completeness, and engagement. A well-optimized profile can generate inbound messages from recruiters in your target field on a regular basis.</p>

<h2>Your Headline: The Most Underused Real Estate on LinkedIn</h2>
<p>Most people use their headline as a job title: "Marketing Manager at Acme Corp." This is a missed opportunity. Your headline appears in search results, connection requests, and comment threads — it's working even when you're not.</p>
<p>Instead, use your headline to communicate your value and target role:</p>
<ul>
  <li><strong>Before:</strong> "Marketing Manager at Acme Corp"</li>
  <li><strong>After:</strong> "B2B Marketing Manager | Demand Generation & Content Strategy | HubSpot, Salesforce"</li>
</ul>
<p>Pack in relevant keywords for the role you want, not just the role you have.</p>

<h2>The About Section: Write for Humans, Optimize for Search</h2>
<p>Your About section (summary) is 2,600 characters of opportunity that most people waste on vague, third-person prose. Instead:</p>
<ul>
  <li>Write in first person — it's a professional network, not a CV</li>
  <li>Open with a hook that captures your professional story in 2–3 lines</li>
  <li>Include the job titles and skills you want to be found for</li>
  <li>End with a clear call to action (open to opportunities, connect, email me)</li>
</ul>
<p>LinkedIn shows only the first 3 lines before the "see more" cutoff — make those lines count.</p>

<h2>Experience Section: Use Resume-Quality Bullet Points</h2>
<p>LinkedIn's Experience section often reads like a job description ("Responsible for managing team...") rather than an achievement record. Apply the same Action + Scope + Result formula you'd use on your resume:</p>
<ul>
  <li>Quantify impact wherever possible</li>
  <li>Use strong action verbs that match your target job descriptions</li>
  <li>Include keywords your industry uses — this directly affects LinkedIn search ranking</li>
</ul>

<h2>Skills Section: Strategic Keyword Placement</h2>
<p>The Skills section is one of LinkedIn's primary search filters. Recruiters frequently filter by skill. Add up to 50 skills, prioritizing the ones most relevant to roles you're targeting.</p>
<p>Tips:</p>
<ul>
  <li>Pin your top 3 skills (they appear prominently)</li>
  <li>Focus on hard skills, tools, and methodologies — not soft skills like "teamwork"</li>
  <li>Get endorsements for key skills to boost credibility (and ask colleagues directly — most people are happy to reciprocate)</li>
</ul>

<h2>The Profile Photo and Banner</h2>
<p>Profiles with a professional photo receive 21× more profile views and 36× more messages, according to LinkedIn's own data.</p>
<ul>
  <li><strong>Photo:</strong> Headshot with a clean background, professional dress, neutral expression. No selfies or group photos cropped down.</li>
  <li><strong>Banner:</strong> Most people leave this as the default blue gradient. A custom banner (your industry, a simple branded background, or a relevant image) immediately signals that you're active and intentional about your profile.</li>
</ul>

<h2>Open to Work: Use It Strategically</h2>
<p>LinkedIn's "Open to Work" feature sends signals to recruiters. You have two options:</p>
<ul>
  <li><strong>Visible to all:</strong> Shows a green "#OpenToWork" frame on your photo — signals active job seeking publicly</li>
  <li><strong>Visible to recruiters only:</strong> Hidden from your network — better if you're employed and don't want your employer to see you're looking</li>
</ul>
<p>If you're actively job seeking, being visible to recruiters only is usually the safer choice. Recruiters on LinkedIn Recruiter can still see you're open — your current employer typically cannot.</p>

<h2>Activity and Engagement</h2>
<p>LinkedIn's algorithm rewards active users. You don't need to post daily, but occasional engagement dramatically increases your profile visibility:</p>
<ul>
  <li>Comment thoughtfully on posts in your industry — your name and headline appear in every comment</li>
  <li>Share articles or insights relevant to your field 1–2× per week</li>
  <li>Congratulate connections on new roles (the algorithm picks this up)</li>
</ul>
<p>Even 15 minutes of engagement per week can meaningfully increase how often your profile surfaces in recruiter searches.</p>

<h2>The LinkedIn + Resume Combination</h2>
<p>Your LinkedIn profile and your resume should tell the same story with consistent job titles, dates, and companies — but they don't need to be identical. LinkedIn is more conversational and can include context and personality that doesn't belong on a formal resume. Think of them as complementary: the resume gets you through ATS, and LinkedIn gets you found before you even apply.</p>
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
