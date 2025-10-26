export const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-xl font-semibold text-white">CrunchDB</div>
          <nav className="flex space-x-6">
            <a 
              href="https://example.com/help" 
              className="text-sm text-gray-300 hover:text-white"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fas fa-question-circle mr-2"></i>What am I looking at?
            </a>
            <a 
              href="https://example.com" 
              className="text-sm text-gray-300 hover:text-white"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fas fa-globe mr-2"></i>Website
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};