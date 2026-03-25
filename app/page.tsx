
import { Button } from "@/components/ui/button"
export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">សួស្តី</h1>
        <p className="text-lg text-muted-foreground">Welcome to our E-Store</p>
        <p className="text-sm text-muted-foreground">ស្វាគមន៍មកកាន់ហាងអនឡាញរបស់យើង</p>
        <Button>Test shadcn</Button>
      </div>
    </div>
  );
}
