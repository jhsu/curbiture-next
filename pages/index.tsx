import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="py-20">
      Hello World.{" "}
      <Link href="/about">
        <a className="text-blue-500">About</a>
      </Link>
      <Link href="/day">
        <a className="text-blue-500">Day</a>
      </Link>
    </div>
  );
}
