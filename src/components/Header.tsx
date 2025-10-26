export const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <a 
            href="/#/" 
            className="text-lg font-semibold text-white hover:text-gray-300"
          >
            CrunchDB
          </a>
          <nav className="flex space-x-4">
            <a 
              href="/#/help" 
              className="text-xs text-gray-300 hover:text-white"
            >
              <i className="fas fa-question-circle mr-1"></i>What am I looking at?
            </a>
            <a 
              href="/#/changelog" 
              className="text-xs text-gray-300 hover:text-white"
            >
              <i className="fas fa-list-alt mr-1"></i>Changelog
            </a>
            <a 
              href="https://doing.re"
              target="_blank"
              className="text-xs text-gray-300 hover:text-white"
            >
              <i className="fas fa-globe mr-1"></i>Website
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};