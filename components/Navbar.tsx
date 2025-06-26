import { useState } from "react";
import Link from "next/link";
import { FaBrain, FaRobot } from "react-icons/fa";

interface NavbarProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export default function Navbar({ onTabChange, activeTab }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    {
      id: "generate",
      label: "Text Generation",
      icon: <FaRobot className="mr-2" />,
    },
  ];

  return (
    <nav className="glass-dark p-4 shadow-lg w-full navbar-sticky">
      <div className="flex justify-between items-center px-4 max-w-full">
        <Link
          href="/"
          className="text-white text-xl font-bold flex items-center hover:text-purple-300 transition-colors"
        >
          <FaBrain className="mr-2 text-purple-400" /> AI Agent
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white hover:text-purple-300 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? "btn-gradient"
                  : "text-purple-300 hover:bg-purple-900 hover:bg-opacity-50 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mt-3 md:hidden glass-dark rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setIsMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 transition-all duration-300 ${
                activeTab === tab.id
                  ? "btn-gradient"
                  : "text-gray-300 hover:bg-purple-900 hover:bg-opacity-50 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
