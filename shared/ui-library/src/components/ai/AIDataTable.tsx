import React from "react";
import './AIDataTable.css';

export interface DataTableColumn {
  key: string;
  label: string;
}
export interface DataTableRow {
  [key: string]: string | number;
}

export const AIDataTable: React.FC<{ columns: DataTableColumn[]; data: DataTableRow[] }> = ({ columns, data }) => (
  <div className="ai-data-table glassmorphism">
    <table>
      <thead>
        <tr>
          {columns.map(col => <th key={col.key}>{col.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map(col => <td key={col.key}>{row[col.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
