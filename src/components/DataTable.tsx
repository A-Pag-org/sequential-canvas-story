import { useState } from "react";
import { Eye, ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title?: string;
  columns: TableColumn[];
  data: any[];
  expandable?: boolean;
  onRowExpand?: (rowId: string | number) => void;
}

export const DataTable = ({ 
  title, 
  columns, 
  data, 
  expandable = false,
  onRowExpand 
}: DataTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

  const toggleRow = (rowId: string | number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
    onRowExpand?.(rowId);
  };

  const handleEyeClick = (rowId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Show additional data for this row
    console.log(`Viewing details for row ${rowId}`);
  };

  return (
    <Card className="data-table animate-slide-in-up">
      {title && (
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {expandable && <TableHead className="w-12"></TableHead>}
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => {
              const rowId = row.id || index;
              const isExpanded = expandedRows.has(rowId);
              
              return (
                <TableRow
                  key={rowId}
                  className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                    isExpanded ? "bg-muted/30" : ""
                  }`}
                  onClick={() => expandable && toggleRow(rowId)}
                >
                  {expandable && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : column.key === "agency" && row[column.key] ? (
                        <div className="flex items-center gap-2">
                          <span>{row[column.key]}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                            onClick={(e) => handleEyeClick(rowId, e)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span>{row[column.key] || "-"}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};