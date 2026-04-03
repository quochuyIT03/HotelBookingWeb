import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";

const SearchBar = () => {
  return (
    <Card className="p-6 border-0">
      <div className="flex justify-center">
        <div className="flex flex-col gap-3 sm:flex-row ">
        <Input
          type="search"
          className="h-6 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          placeholder="Tên khách sạn, thành phố hoặc điểm đến..."
        />
        <Button variant="gradient" size="sm" className="px-6 ">
          <SearchIcon className="mr-1 size-4 " /> Tìm kiếm
        </Button>
      </div>
      </div>
    </Card>
  );
};

export default SearchBar;
