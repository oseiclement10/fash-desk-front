import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useApiQueryFilter } from "@/hooks/use-api-query-filter";


interface ManualPaginationProps {
  total: string | number;
  className?: string;
  displayType?: string;
  useTab?: boolean;
  tabId?: string;
}

export function ManualPagination({
  total,
  displayType = "Rows",
  useTab,
  tabId,
  className
}: ManualPaginationProps) {

  const { updatePageSize, updateCurrentPage, currentPage, perPage: pageSize } =
    useApiQueryFilter(useTab ? tabId : undefined);

  const currentPageNum = Number(currentPage);

  const pageViewStart =
    total == 0 ? 0 : currentPageNum == 1 ? 1 : (currentPageNum - 1) * Number(pageSize) + 1;

  const pageViewEnd = Math.min(currentPageNum * Number(pageSize), Number(total));

  const pageCount = Math.ceil(Number(total) / Number(pageSize));

  const perPageOptions = preparePerpageOptions(Number(total));

  const perPageDisplay = Number(pageSize) > Math.max(...perPageOptions) ? perPageOptions[perPageOptions.length - 1] : pageSize;

  return (
    <div className={`flex items-center justify-between  lg:justify-end lg:px-2  font-poppins mt-6 ${className} `}>

      <div className="md:flex  hidden items-center space-x-8">
        <div className="flex  items-center space-x-2 flex-row">
          <p className="text-sm mt-0 ">{displayType} per page</p>
          <Select
            value={perPageDisplay?.toString()}
            onValueChange={(value) => {
              updatePageSize(value);
              updateCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[90px] cursor-pointer">
              <SelectValue placeholder={perPageDisplay} />
            </SelectTrigger>
            <SelectContent side="top">
              {perPageOptions.map((pageSize) => (
                <SelectItem className="cursor-pointer" key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex  items-center space-x-3 flex-row ">
          <p className="flex items-center justify-center  text-left text-sm mt-0 w-fit">
            Showing {pageViewStart} to {pageViewEnd} of {total} results
          </p>

          <div className="flex items-center  space-x-2 mt-0">
            <Button
              variant="outline"
              className=" w-10 h-10  flex"
              onClick={() => updateCurrentPage(1)}
              disabled={Number(currentPage) <= 1}
            >
              <span className="sr-only">Go to first page</span>
              <FiChevronsLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              className="w-10 h-10 p-0"
              onClick={() => {
                updateCurrentPage(Number(currentPage) - 1);
              }}
              disabled={Number(currentPage) <= 1}
            >
              <span className="sr-only">Go to previous page</span>
              <MdChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="outline"
              className="w-10 h-10 p-0"
              onClick={() => updateCurrentPage((Number(currentPage) || 1) + 1)}
              disabled={
                currentPage == (pageCount.toString())
              }
            >
              <span className="sr-only">Go to next page</span>
              <MdChevronRight className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              className=" w-10 h-10 flex"
              onClick={() => {
                updateCurrentPage(pageCount);
              }}
              disabled={
                currentPage == (pageCount.toString())
              }
            >
              <span className="sr-only">Go to last page</span>
              <FiChevronsRight className="w-6 h-6" />
            </Button>
          </div>
        </div>


      </div>

      <div className="flex  w-full justify-between md:hidden px-5">

        <div className="flex  flex-col   ">
          <Select
            value={perPageDisplay?.toString()}
            onValueChange={(value) => {
              updatePageSize(value);
              updateCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[90px] cursor-pointer">
              <SelectValue placeholder={perPageDisplay} />
            </SelectTrigger>
            <SelectContent side="top">
              {perPageOptions.map((pageSize) => (
                <SelectItem className="cursor-pointer" key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm mt-2">{displayType} per page</p>
        </div>

        <div className="flex  flex-col   ">


          <div className="flex items-center justify-center  space-x-3 ">

            <Button
              variant="outline"
              className="w-10 border-gray-300 h-10 p-0"
              onClick={() => {
                updateCurrentPage(Number(currentPage) - 1);
              }}
              disabled={Number(currentPage) <= 1}
            >
              <span className="sr-only">Go to previous page</span>
              <MdChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="outline"
              className="w-10 border-gray-300 h-10 p-0"
              onClick={() => updateCurrentPage((Number(currentPage) || 1) + 1)}
              disabled={
                currentPage == (pageCount.toString())
              }
            >
              <span className="sr-only">Go to next page</span>
              <MdChevronRight className="w-6 h-6" />
            </Button>


          </div>

          <p className="text-sm mt-2">
            Showing {pageViewStart} to {pageViewEnd} of {total} results
          </p>
        </div>

      </div>
    </div>
  );
}


const preparePerpageOptions = (total: number) => {
  const options = [10, 20, 50, 100, 300, 500, 700, 1000].filter(elem => elem <= total);


  if (options[options.length - 1] != total && total < 1000) {
    options.push(total);
  }

  return options;

}