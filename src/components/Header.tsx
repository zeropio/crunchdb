export const Header = () => {
  return (
    <header className="bg-gray-800/90 backdrop-blur-xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <a 
            href="/#/" 
            className="text-lg font-semibold text-white hover:text-gray-300 transition-colors"
          >
            CrunchDB
          </a>
          <nav className="flex space-x-6">
            <a 
              href="/#/help" 
              className="group flex items-center space-x-1.5 text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-200"
            >
              <i className="fas fa-question-circle text-cyan-400/80 group-hover:text-cyan-400"></i>
              <span>What am I looking at?</span>
            </a>
            <a 
              href="/#/changelog" 
              className="group flex items-center space-x-1.5 text-sm text-gray-300 hover:text-blue-400 transition-colors duration-200"
            >
              <i className="fas fa-list-alt text-blue-400/80 group-hover:text-blue-400"></i>
              <span>Changelog</span>
            </a>
            <a 
              href="https://doing.re"
              target="_blank"
              className="group flex items-center space-x-1.5 text-sm text-gray-300 hover:text-green-400 transition-colors duration-200"
            >
              <i className="fas fa-globe text-green-400/80 group-hover:text-green-400"></i>
              <span>Website</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};