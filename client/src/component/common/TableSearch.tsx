import { Input, Select, Button } from "antd";
import { Search, XCircle } from "lucide-react";
import { useState } from "react";
import { storeSearch } from "../../action/StoreSearch";
import { useAppDispatch } from "../../Hooks/hook";
import dayjs from "dayjs";

const statusOptions = [
    { value: "shortlisted", label: "Shortlisted" },
    { value: "first interview", label: "First Interview" },
    { value: "second interview", label: "Second Interview" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
];

const techOptions = [
    { value: "react js", label: "React JS" },
    { value: "dot net", label: "Dot Net" },
    { value: "devops", label: "DevOps" },
    { value: "qa", label: "QA" },
];

const levelOptions = [
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid" },
    { value: "senior", label: "Senior" },
];

const TableSearch = () => {
    const dispatch = useAppDispatch();

    const [name, setName] = useState("");
    const [selectedTechnology, setSelectedTechnology] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleSearch = (nameValue: string) => {
        dispatch(storeSearch(nameValue, selectedTechnology, selectedStatus, selectedLevel, dayjs(), ""));
    };

    const handleReset = () => {
        setName("");
        setSelectedTechnology("");
        setSelectedLevel("");
        setSelectedStatus("");
        dispatch(storeSearch("", "", "", "", dayjs(), ""));
    };

    return (
        <div className="flex flex-wrap gap-4 items-end">
            <Input.Search
                placeholder="Search candidates by name..."
                allowClear
                enterButton={<Search className="w-4 h-4" />}
                value={name}
                onChange={(e) => {
                    const value = e.target.value;
                    setName(value);
                    if (value === "") {
                        dispatch(storeSearch("", selectedTechnology, selectedStatus, selectedLevel || "", dayjs(), ""));
                    }
                }}
                onSearch={() => handleSearch(name)}
                className="w-96"
            />

            <Select
                placeholder="Filter by Technology"
                value={selectedTechnology || undefined}
                allowClear
                onChange={(value) => {
                    const newValue = value || "";
                    setSelectedTechnology(newValue);
                    dispatch(storeSearch(name, newValue, selectedStatus, selectedLevel || "", dayjs(), ""));
                }}
                className="min-w-[200px]"
                options={techOptions}
            />

            <Select
                placeholder="Filter by Level"
                value={selectedLevel || undefined}
                allowClear
                onChange={(value) => {
                    const newValue = value || "";
                    setSelectedLevel(newValue);
                    dispatch(storeSearch(name, selectedTechnology, selectedStatus, newValue || "", dayjs(), ""));
                }}
                className="min-w-[200px]"
                options={levelOptions}
            />

            <Select
                placeholder="Filter by Status"
                value={selectedStatus || undefined}
                allowClear
                onChange={(value) => {
                    const newValue = value || "";
                    setSelectedStatus(newValue);
                    dispatch(storeSearch(name, selectedTechnology, newValue, selectedLevel || "", dayjs(), ""));
                }}
                className="min-w-[200px]"
                options={statusOptions}
            />

            <Button
                type="default"
                icon={<XCircle className="w-4 h-4" />}
                onClick={handleReset}
            >
                Reset
            </Button>
        </div>
    );
};

export default TableSearch;
