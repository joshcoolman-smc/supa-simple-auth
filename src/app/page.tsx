import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="text-3xl">Home Page</h1>
      <Link href="/login" className="text-sky-300">
        Sign In
      </Link>
    </div>
  );
}
