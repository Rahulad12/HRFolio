import { Dropdown, Input, MenuProps } from "antd";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import { storeSearch } from "../../action/StoreSearch";
import { useAppDispatch } from "../../Hooks/hook";
import dayjs from "dayjs";

const statusOptions = [
    { value: "", label: "All" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "first interview", label: "First Interview" },
    { value: "second interview", label: "Second Interview" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
];

const TableSearch = () => {
    const dispatch = useAppDispatch();

    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    console.log(searchText);

    const handleSearch = () => {
        dispatch(storeSearch(searchText, "", selectedStatus, dayjs(), ""));
    };

    const handleStatusChange: MenuProps["onClick"] = (info) => {
        const status = info.key;
        setSelectedStatus(status);
        dispatch(storeSearch(searchText, "", status, dayjs(), ""));
    }

    const dropdownItems: MenuProps["items"] = statusOptions.map((option) => ({
        key: option.value,
        label: option.label,
    }))


    return (
        <div className="flex flex-wrap gap-4 justify-between max-w-full p-2">
            <Input.Search
                placeholder="Search by name or technology..."
                allowClear
                enterButton={<Search className="w-4 h-4" />}
                value={searchText}
                style={{ width: 304 }}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearchText(value);

                    if (value === "") {
                        dispatch(storeSearch("", "all", selectedStatus, dayjs()));
                    }
                }}
                onSearch={handleSearch}
            />

            {/* DropDown Filter by status  */}
            <Dropdown menu={{ items: dropdownItems, onClick: handleStatusChange }} trigger={['click']}>
                <div className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-100  transition">
                    <Filter className="w-4 h-4 text-blue-950" />
                    <span className="text-sm text-blue-950">{selectedStatus}</span>
                </div>
            </Dropdown>
            {/* <Select
                placeholder="Filter by Status"
                value={selectedStatus || undefined}
                allowClear
                showSearch
                onChange={(value) => {
                    const newValue = value || "";
                    setSelectedStatus(newValue);

                    dispatch(storeSearch(searchText, "all", newValue, dayjs(), ""));
                }}
                className="min-w-[200px]"
                options={statusOptions}
            /> */}
        </div>
    );
};

export default TableSearch;
