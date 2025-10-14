const SleepEntryList = ({ entries }) => {
    if (!entries.length) return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Sleep Logs</h2>
        <p className="text-zinc-400 text-center py-8">No entries yet. Add your first sleep record!</p>
      </div>
    );
  
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Sleep Logs</h2>
        <div className="overflow-hidden rounded-lg border border-zinc-700">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-zinc-800 text-zinc-300">
                <th className="p-3 text-left font-medium">Date</th>
                <th className="p-3 text-left font-medium">Sleep Time</th>
                <th className="p-3 text-left font-medium">Wake Time</th>
                <th className="p-3 text-left font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className={`border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors ${
                  index % 2 === 0 ? 'bg-zinc-900/30' : 'bg-zinc-900/10'
                }`}>
                  <td className="p-3 text-zinc-300">{entry.date}</td>
                  <td className="p-3 text-zinc-300">{entry.sleepTime}</td>
                  <td className="p-3 text-zinc-300">{entry.wakeTime}</td>
                  <td className="p-3 text-white font-semibold">{entry.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default SleepEntryList;