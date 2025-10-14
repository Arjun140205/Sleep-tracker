import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportButton = ({ entries }) => {
  const handleExport = () => {
    if (!entries.length) {
      alert("No data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SleepData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "sleep_tracker_data.xlsx");
  };

  return (
    <button
      onClick={handleExport}
      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      ⬇️ Export to Excel
    </button>
  );
};

export default ExportButton;