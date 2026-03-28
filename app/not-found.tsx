import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center flex flex-col items-center">
        
        <Image 
          src="/images/web.png" 
          width={96} 
          height={96} 
          alt="Not found"
          className="mb-4"
        />

        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Button asChild>
          <Link href="/">
            Go Home
          </Link>
        </Button>

      </div>
    </div>
  )
}