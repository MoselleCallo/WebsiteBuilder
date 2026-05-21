export default function Header() {
  return (
    <header className="sticky top-0 w-full h-16 z-50 bg-[#09213D]">
      <div className="flex justify-between p-4 items-center">
        {/* Left side */}
        <div className="flex gap-4 items-center">
          <input
            type-text
            className="bg-transparent text-white w-1/4 px-2"
            defaultValue="Untitled1"
          />
          {/* View Option + dropdown Icon */}
          <div className="flex gap-2 items-center">
            <p className="text-xs text-white font-bold">Desktop</p>
            <button className="">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex gap-4">
          <button className="py-2 px-3 bg-white font-semibold text-sm rounded-full">
            Preview
          </button>
          <button className="py-2 px-3 bg-[#349BC9] text-white font-semibold text-sm rounded-full">
            Publish
          </button>
        </div>
      </div>
    </header>
  );
}
