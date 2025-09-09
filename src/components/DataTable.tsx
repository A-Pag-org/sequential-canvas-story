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
import { cn } from "@/lib/utils";

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
    <Card className="data-table animate-card-enter">
      {title && (
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/60 transition-colors">
              {expandable && <TableHead className="w-12"></TableHead>}
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold text-foreground">
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
                  className={cn(
                    "hover:bg-muted/50 transition-all duration-300 cursor-pointer border-b border-border/50",
                    isExpanded ? "bg-muted/30 shadow-sm" : "",
                    "animate-slide-in-up"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => expandable && toggleRow(rowId)}
                >
                  {expandable && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key} className="font-medium">
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : column.key === "agency" && row[column.key] ? (
                        <div className="flex items-center gap-2">
                          <span>{row[column.key]}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:bg-info/10 transition-all duration-200"
                            onClick={(e) => handleEyeClick(rowId, e)}
                          >
                            <Eye className="h-4 w-4 text-info" />
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