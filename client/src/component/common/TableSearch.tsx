import { Input, Select } from "antd";
import { use, useEffect, useState } from "react";
import dayjs from "dayjs";
import { storeSearch } from "../../action/StoreSearch";
import { useAppDispatch } from "../../Hooks/hook";
import { Search } from "lucide-react";

const { Option } = Select;

interface StatusOption {
    label: string;
    value: string;
}

interface TableSearchProps {
    items?: StatusOption[];
    placeholder?: string;

}

const TableSearch = ({
    items = [],
    placeholder = "Search",


}: TableSearchProps) => {
    const dispatch = useAppDispatch();

    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // const handleSearch = () => {
    //     dispatch(storeSearch(searchText, selectedStatus, dayjs(), ""));
    // };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        dispatch(storeSearch(searchText, value, dayjs(), ""));
        if (value === "") {
            dispatch(storeSearch(searchText, "", dayjs(), ""));
        }
    };

    const handleInputChange = (value: string) => {
        setSearchText(value);
        dispatch(storeSearch(searchText, selectedStatus, dayjs(), ""));
        if (value === "") {
            dispatch(storeSearch("", selectedStatus, dayjs(), ""));
        }
    };

    return (
        <div className="flex flex-wrap gap-4  items-center p-2  w-full ">
            <div className="flex items-center gap-2 w-full md:w-1/2 ">
                <Input
                    placeholder={placeholder}
                    allowClear
                    value={searchText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    prefix={<Search size={16} className="text-gray-500" />}
                />
            </div>

            <Select
                allowClear
                value={selectedStatus}
                onChange={handleStatusChange}
                placeholder="Filter by status"
                className="w-50"
                showSearch
            >
                {items.map((option) => (
                    <Option key={option.value} value={option.value} className="text-sm">
                        {option.label}
                    </Option>
                ))}
            </Select>
        </div >
    );
};

export default TableSearch;
