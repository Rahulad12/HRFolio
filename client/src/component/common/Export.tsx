import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from 'antd';
import { Download } from 'lucide-react';

interface Props {
    dataType?: string
    data?: any,
    fileName?: string
}
const ExportButton = ({
    data,
    fileName
}: Props) => {
    const exportToExcel = (data: any, fileName = "Candidates") => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <div>
            <Button
                type="default"
                icon={<Download size={16} />}
                aria-label="Export"
                onClick={() => exportToExcel(data, fileName)}
            >
                Export
            </Button>
        </div>
    )
}

export default ExportButton
