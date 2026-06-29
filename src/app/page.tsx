import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Enterprise Builder SaaS Platform
        </p>
      </div>

      <div className="relative flex place-items-center flex-col gap-6 mt-16">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-center">
          Next-Gen Real Estate <br /> Management System
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mt-4">
          The all-in-one multi-tenant SaaS platform for Indian Real Estate Builders. Manage projects, sales, construction, and customer relations in one place.
        </p>
        <div className="flex gap-4 mt-8">
          <Link href="/login">
            <Button size="lg" className="h-12 px-8">Login to Portal</Button>
          </Link>
          <Link href="/docs">
            <Button size="lg" variant="outline" className="h-12 px-8">View Documentation</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
