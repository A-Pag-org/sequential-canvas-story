import React, { useState } from "react";
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
  renderExpanded?: (row: any) => React.ReactNode;
  eyeInCity?: boolean;
}

export const DataTable = ({
  title,
  columns,
  data,
  expandable = false,
  onRowExpand,
  renderExpanded,
  eyeInCity = false,
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
    toggleRow(rowId);
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
              {expandable && !eyeInCity && <TableHead className="w-12"></TableHead>}
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
                <React.Fragment key={rowId}>
                  <TableRow
                    key={rowId}
                    className={cn(
                      "hover:bg-muted/50 transition-all duration-300 border-b border-border/50",
                      isExpanded ? "bg-muted/30 shadow-sm" : "",
                      eyeInCity ? "cursor-default" : "cursor-pointer",
                      "animate-slide-in-up"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => expandable && !eyeInCity && toggleRow(rowId)}
                  >
                    {expandable && !eyeInCity && (
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
                      {eyeInCity && column.key === "city" ? (
                        <div className="flex items-center gap-2">
                          <span>{row[column.key] || "-"}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? "Hide details" : "Show details"}
                            className="h-6 w-6 p-0 opacity-80 hover:opacity-100 hover:bg-info/10 transition-all duration-200"
                            onClick={(e) => handleEyeClick(rowId, e)}
                          >
                            <Eye className={cn("h-4 w-4", isExpanded ? "text-info" : "text-muted-foreground")} />
                          </Button>
                        </div>
                      ) : (
                        // For other cells, optionally gate content until expanded when using eyeInCity
                        (eyeInCity && (column.key === "agency" || column.key === "turnAroundTime") && !isExpanded)
                          ? <span>-</span>
                          : (column.render ? column.render(row[column.key], row) : <span>{row[column.key] || "-"}</span>)
                      )}
                    </TableCell>
                  ))}
                  </TableRow>
                  {expandable && !eyeInCity && isExpanded && renderExpanded && (
                    <TableRow className="bg-muted/40 border-b border-border/50">
                      <TableCell colSpan={columns.length + (expandable && !eyeInCity ? 1 : 0)}>
                        {renderExpanded(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
