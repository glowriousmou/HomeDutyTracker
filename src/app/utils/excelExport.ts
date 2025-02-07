import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";

const ExcelExport = ({ exportedData, fileName, btnTitle }) => {
  const exportToExcel = () => {
    // const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    // console.log(fileName);

    const data = exportedData();
    // console.log(data);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
    // console.log("exportToExcel", fileName);
  };

  return (
    <MDButton
      type="submit"
      variant="gradient"
      color="info"
      sx={{ marginLeft: "auto", marginRight: 10, marginTop: 2 }}
      onClick={exportToExcel}
    >
      {btnTitle}
    </MDButton>
  );
};

export default ExcelExport;
ExcelExport.defaultProps = {
  exportedData: () => {},
  // data: [],
  fileName: "",
  btnTitle: "Exporter en format Excel",
};
ExcelExport.propTypes = {
  exportedData: PropTypes.func,
  fileName: PropTypes.string,
  btnTitle: PropTypes.string,
};
