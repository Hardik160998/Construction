import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
        The full Software Requirements Document (SRD) has been generated as Markdown files and is located in the <strong>/docs</strong> folder in the root of your workspace.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
