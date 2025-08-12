import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const TableSkeleton = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[60px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[40px]" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-5 w-5 rounded-full ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
