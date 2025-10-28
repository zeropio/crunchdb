export const Help = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">What is CrunchDB?</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">About CrunchDB</h2>
          <p className="text-gray-300">
            CrunchDB is Apple's Magic Number Database - a comprehensive collection of identifiers, 
            hex values, and their corresponding names used across Apple's ecosystem. Swift support WIP!

            A real database will be implemented later for optimization. Now, "it just works".
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">How to Use</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Use the search bar to find magic numbers by ID, hex value, name, or source</li>
            <li>Results will show you the corresponding values and their sources</li>
            <li>Each entry may have multiple name-source pairs from different references</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">Data Sources</h2>
          <p className="text-gray-300">
            The data in CrunchDB is compiled from various Apple documentation, 
            header files, and reverse engineering efforts to provide accurate 
            magic number references. JSONs are obtained with <a href="https://github.com/zeropio/CrunchFinder" target="_blank">CrunchFinder</a>.
          </p>
        </section>

      </div>
    </div>
  );
};