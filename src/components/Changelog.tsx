interface ChangeItem {
  version: string;
  date: string;
  changes: string[];
}

export const Changelog = () => {
  const changelogData: ChangeItem[] = [
    {
      version: "0.0.1",
      date: "2024-26-10",
      changes: [
        "Initial work of CrunchDB",
        "Basic search functionality",
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Changelog</h1>
      
      <div className="space-y-8">
        {changelogData.map((release, index) => (
          <div key={release.version} className="flex">
            {/* Vertical line */}
            <div className="flex flex-col items-center mr-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full border-4 border-gray-900"></div>
              {index !== changelogData.length - 1 && (
                <div className="w-0.5 h-full bg-gray-600 mt-2"></div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center mb-2">
                <h2 className="text-2xl font-semibold text-white mr-4">
                  v{release.version}
                </h2>
                <span className="text-sm text-gray-400">{release.date}</span>
              </div>
              
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {release.changes.map((change, changeIndex) => (
                  <li key={changeIndex}>{change}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};