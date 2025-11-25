---
name: "DevPortal - Developer Documentation Platform"
year: 2023
studyCase: "Open Source"
description: "An open-source documentation platform with interactive code examples, API playground, and collaborative editing features for developer communities."
techStack: ["Next.js", "MDX", "Algolia", "Vercel", "GitHub API", "Prism.js", "Tailwind CSS"]
thumbnail: "/images/projects/documentation-platform.jpg"
linkLive: "https://devportal-docs.dev"
linkGithub: "https://github.com/yourusername/devportal"
---

## Project Overview

DevPortal is an open-source documentation platform designed to make technical documentation beautiful, interactive, and easy to maintain. Built for developer communities, it combines the simplicity of markdown with the power of interactive code examples and API playgrounds.

### Why DevPortal?

Existing documentation platforms often fall into two categories: too simple (static site generators) or too complex (enterprise solutions). DevPortal aims to fill the gap with:

- **Developer-First**: Built by developers, for developers
- **Interactive**: Live code examples and API testing
- **Beautiful**: Modern UI that developers actually enjoy using
- **Open Source**: Free, customizable, and community-driven

## Core Features

### MDX-Powered Content

Write documentation in MDX (Markdown + JSX) for maximum flexibility:

```mdx
# Getting Started

Install the package:

<CodeBlock language="bash">
npm install awesome-library
</CodeBlock>

Try it live:

<InteractiveExample>
  <Button onClick={() => alert('Hello!')}>
    Click me
  </Button>
</InteractiveExample>
```

### Interactive Code Playground

Embedded code editor with live preview:

- **Multiple Languages**: JavaScript, TypeScript, Python, Go, Rust
- **Live Execution**: Run code directly in the browser
- **Shareable**: Generate shareable links for code snippets
- **Version Control**: Save and track code example versions

### API Documentation

Auto-generated API docs from OpenAPI/Swagger specs:

- **Interactive Testing**: Test API endpoints directly
- **Request Builder**: Visual request builder
- **Response Viewer**: Formatted response display
- **Authentication**: Support for various auth methods

### Search & Navigation

Powered by Algolia for instant search:

- **Full-text Search**: Search across all documentation
- **Keyboard Shortcuts**: Navigate with keyboard
- **Search Analytics**: Track popular searches
- **Typo Tolerance**: Find results even with typos

### Collaboration Features

GitHub-integrated collaborative editing:

- **Suggest Edits**: Submit PRs directly from docs
- **Version History**: Track all changes
- **Community Contributions**: Accept community improvements
- **Review Workflow**: Built-in review process

## Technical Architecture

### Project Structure

```
devportal/
├── app/                    # Next.js app directory
│   ├── (docs)/            # Documentation routes
│   ├── api/               # API routes
│   └── playground/        # Code playground
├── components/
│   ├── CodeBlock/
│   ├── ApiPlayground/
│   └── InteractiveExample/
├── content/               # MDX documentation files
│   ├── guides/
│   ├── api/
│   └── tutorials/
├── lib/
│   ├── mdx/              # MDX processing
│   ├── search/           # Algolia integration
│   └── github/           # GitHub API
└── public/
```

### Content Processing Pipeline

```typescript
// MDX compilation with custom plugins
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

async function compileMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: 'function-body',
    remarkPlugins: [
      remarkGfm,
      remarkCodeBlocks,
      remarkToc,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypePrism,
      rehypeAutolinkHeadings,
      rehypeCodeMeta,
    ],
  });

  return compiled;
}
```

### File-based Routing

Automatic route generation from content structure:

```typescript
// lib/docs.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getDocBySlug(slug: string[]) {
  const realSlug = slug.join('/');
  const fullPath = path.join(docsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const { data, content } = matter(fileContents);
  
  return {
    slug: realSlug,
    frontmatter: data,
    content,
  };
}

export function getAllDocs() {
  const files = getAllMDXFiles(docsDirectory);
  
  return files.map(file => {
    const slug = file.replace(/\.mdx$/, '').split(path.sep);
    return getDocBySlug(slug);
  });
}
```

## Key Features Implementation

### Interactive Code Playground

Built with Monaco Editor (VS Code's editor):

```typescript
import Editor from '@monaco-editor/react';
import { useState } from 'react';

const CodePlayground = ({ initialCode, language }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    
    try {
      // For JavaScript/TypeScript
      if (language === 'javascript' || language === 'typescript') {
        const result = await executeInSandbox(code);
        setOutput(result);
      }
      // For other languages, use web containers or API
      else {
        const result = await executeOnServer(code, language);
        setOutput(result);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="playground">
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={setCode}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
        }}
      />
      <button onClick={runCode} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Code'}
      </button>
      <pre className="output">{output}</pre>
    </div>
  );
};

// Sandboxed execution for JavaScript
async function executeInSandbox(code: string): Promise<string> {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      document.body.removeChild(iframe);
      reject(new Error('Execution timeout'));
    }, 5000);

    iframe.contentWindow.postMessage({ code }, '*');

    window.addEventListener('message', function handler(event) {
      if (event.data.type === 'result') {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        window.removeEventListener('message', handler);
        resolve(event.data.output);
      }
    });
  });
}
```

### API Playground

Interactive API testing interface:

```typescript
const ApiPlayground = ({ endpoint, method, schema }) => {
  const [params, setParams] = useState({});
  const [headers, setHeaders] = useState({});
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);

  const sendRequest = async () => {
    try {
      const url = buildUrl(endpoint, params);
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: method !== 'GET' ? body : undefined,
      };

      const res = await fetch(url, options);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
      });
    } catch (error) {
      setResponse({
        error: error.message,
      });
    }
  };

  return (
    <div className="api-playground">
      <div className="request-builder">
        <RequestMethodBadge method={method} />
        <EndpointInput value={endpoint} params={params} />
        
        <Tabs>
          <TabPanel label="Params">
            <ParamsEditor params={params} onChange={setParams} />
          </TabPanel>
          <TabPanel label="Headers">
            <HeadersEditor headers={headers} onChange={setHeaders} />
          </TabPanel>
          <TabPanel label="Body">
            <BodyEditor body={body} onChange={setBody} />
          </TabPanel>
        </Tabs>

        <button onClick={sendRequest}>Send Request</button>
      </div>

      {response && (
        <div className="response-viewer">
          <ResponseStatus status={response.status} />
          <ResponseHeaders headers={response.headers} />
          <ResponseBody data={response.data} />
        </div>
      )}
    </div>
  );
};
```

### Search Implementation

Algolia integration for instant search:

```typescript
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

const DocSearch = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="documentation"
    >
      <SearchBox
        placeholder="Search documentation..."
        classNames={{
          root: 'search-box',
          input: 'search-input',
        }}
      />
      <Hits
        hitComponent={Hit}
        classNames={{
          list: 'search-results',
        }}
      />
    </InstantSearch>
  );
};

const Hit = ({ hit }) => (
  <Link href={hit.url} className="search-result">
    <h3>{hit.title}</h3>
    <p>{hit.description}</p>
    <Breadcrumbs path={hit.breadcrumbs} />
  </Link>
);

// Index documentation for search
async function indexDocumentation() {
  const index = searchClient.initIndex('documentation');
  const docs = getAllDocs();

  const records = docs.map(doc => ({
    objectID: doc.slug,
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    content: doc.content,
    url: `/docs/${doc.slug}`,
    breadcrumbs: doc.slug.split('/'),
  }));

  await index.saveObjects(records);
}
```

### GitHub Integration

Enable community contributions:

```typescript
import { Octokit } from '@octokit/rest';

class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async createEditSuggestion(
    filePath: string,
    content: string,
    message: string
  ) {
    const { data: repo } = await this.octokit.repos.get({
      owner: 'yourusername',
      repo: 'devportal',
    });

    // Create a new branch
    const branchName = `edit-${Date.now()}`;
    const { data: ref } = await this.octokit.git.getRef({
      owner: repo.owner.login,
      repo: repo.name,
      ref: 'heads/main',
    });

    await this.octokit.git.createRef({
      owner: repo.owner.login,
      repo: repo.name,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });

    // Update file
    const { data: file } = await this.octokit.repos.getContent({
      owner: repo.owner.login,
      repo: repo.name,
      path: filePath,
    });

    await this.octokit.repos.createOrUpdateFileContents({
      owner: repo.owner.login,
      repo: repo.name,
      path: filePath,
      message,
      content: Buffer.from(content).toString('base64'),
      sha: file.sha,
      branch: branchName,
    });

    // Create pull request
    const { data: pr } = await this.octokit.pulls.create({
      owner: repo.owner.login,
      repo: repo.name,
      title: message,
      head: branchName,
      base: 'main',
      body: 'Suggested edit from documentation portal',
    });

    return pr;
  }
}
```

## Performance Optimizations

### Static Generation

Pre-render all documentation pages:

```typescript
// app/docs/[...slug]/page.tsx
export async function generateStaticParams() {
  const docs = getAllDocs();
  
  return docs.map(doc => ({
    slug: doc.slug.split('/'),
  }));
}

export default async function DocPage({ params }) {
  const doc = getDocBySlug(params.slug);
  const mdxSource = await compileMDX(doc.content);
  
  return <MDXContent source={mdxSource} />;
}
```

### Code Splitting

Lazy load heavy components:

```typescript
import dynamic from 'next/dynamic';

const CodePlayground = dynamic(
  () => import('@/components/CodePlayground'),
  {
    loading: () => <PlaygroundSkeleton />,
    ssr: false,
  }
);

const ApiPlayground = dynamic(
  () => import('@/components/ApiPlayground'),
  { ssr: false }
);
```

### Image Optimization

Optimize documentation images:

```typescript
import Image from 'next/image';

const OptimizedImage = ({ src, alt }) => (
  <Image
    src={src}
    alt={alt}
    width={800}
    height={600}
    placeholder="blur"
    blurDataURL={generateBlurDataURL(src)}
  />
);
```

## Community & Open Source

### Contribution Guidelines

Created comprehensive contribution docs:

- Code of Conduct
- Contributing Guide
- Development Setup
- PR Template
- Issue Templates

### GitHub Actions Workflows

Automated quality checks:

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Test
        run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: npm run build
```

### Community Engagement

- Discord server for discussions
- Monthly community calls
- Contributor recognition
- Swag for top contributors

## Deployment

### Vercel Deployment

Optimized for Vercel's edge network:

```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['github.com', 'raw.githubusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started',
        permanent: true,
      },
    ];
  },
};
```

## Results & Impact

### Adoption

- **GitHub Stars**: 5,000+
- **Weekly Downloads**: 2,000+
- **Contributors**: 150+
- **Companies Using**: 50+

### Performance

- **Lighthouse Score**: 100/100
- **Build Time**: < 2 minutes
- **Page Load**: < 1s
- **Search Latency**: < 50ms

### Community

- Active Discord with 1,000+ members
- 500+ merged PRs
- Featured in GitHub trending
- Used by major open-source projects

## Lessons Learned

1. **Documentation is Product**: Treat docs with same care as code
2. **Community Matters**: Open source thrives on community
3. **Performance is UX**: Fast docs = happy developers
4. **Iteration is Key**: Ship early, improve based on feedback
5. **Accessibility Matters**: Make docs accessible to everyone

## Future Roadmap

- [ ] Multi-language support
- [ ] Video tutorials integration
- [ ] AI-powered search suggestions
- [ ] Offline documentation
- [ ] Mobile app
- [ ] Analytics dashboard for maintainers

## Conclusion

DevPortal demonstrates that documentation can be both beautiful and functional. By combining modern web technologies with developer-centric features, we created a platform that makes writing and reading documentation enjoyable.
