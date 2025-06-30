import Link from "next/link";
import { FaBrain } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="glass-dark p-4 shadow-lg w-full navbar-sticky mb-6">
      <div className="flex justify-center items-center px-4 max-w-full">
        <Link
          href="/"
          className="text-white text-xl font-bold flex items-center hover:text-purple-300 transition-colors"
        >
          <FaBrain className="mr-2 text-purple-400" /> AI Agent - Agentic RAG
        </Link>
      </div>
    </nav>
  );
}
