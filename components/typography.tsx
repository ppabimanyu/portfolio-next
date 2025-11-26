export default function Typography({ html }: { html: string }) {
  return (
    <div
      className="prose dark:prose-invert max-w-none prose-headings:underline prose-headings:underline-offset-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
