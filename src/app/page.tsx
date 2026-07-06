import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      {/* Dramatic background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-[#0a0a0f] to-[#0a0a0f] opacity-80" />
      
      <div className="z-10 text-center space-y-12 w-full max-w-sm">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif text-white tracking-widest text-glow-red uppercase font-bold">
            Mafia
          </h1>
          <p className="text-neutral-400 text-sm tracking-widest uppercase">
            A Social Deduction Game
          </p>
        </div>

        <div className="space-y-6 pt-12">
          <Link href="/setup" className="block w-full">
            <Button size="lg" className="w-full text-lg font-bold bg-accent-red hover:bg-red-700 text-white border-0 py-6">
              Start Game
            </Button>
          </Link>
          
          <div className="glass rounded-xl p-4 text-xs text-neutral-400">
            <p>Pass-the-phone edition. No downloads. No accounts. Just open and play.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
