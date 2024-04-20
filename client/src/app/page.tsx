import Link from "next/link";

import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <main className="h-full flex-col flex items-center justify-center gap-y-5 md:gap-y-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center">
        Welcome to&nbsp;
        <span className="text-accent underline">Poll Creator</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-2 md:gap-3">
        <Button size="lg" asChild>
          <Link href="/create">Create Poll</Link>
        </Button>

        <Button size="lg" variant="outline" asChild>
          <Link href="/join">Join Poll</Link>
        </Button>
      </div>
    </main>
  );
};

export default HomePage;
