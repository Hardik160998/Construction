import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Login Page</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
        The authentication module using Supabase Auth is currently being built in Phase 3.
      </p>
      <Link href="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
}
