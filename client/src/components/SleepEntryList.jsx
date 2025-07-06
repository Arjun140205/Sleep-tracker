const SleepEntryList = ({ entries }) => {
    if (!entries.length) return <p>No entries yet. Add your first sleep record!</p>;
  
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Sleep Logs</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">Date</th>
              <th className="p-2">Sleep Time</th>
              <th className="p-2">Wake Time</th>
              <th className="p-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{entry.date}</td>
                <td className="p-2">{entry.sleepTime}</td>
                <td className="p-2">{entry.wakeTime}</td>
                <td className="p-2">{entry.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default SleepEntryList;