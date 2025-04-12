import { Input, Select } from "antd"
import { Search } from "lucide-react"
import { useState } from "react";
import { storeSearch } from "../../action/StoreSearch";
import { useAppDispatch } from "../../Hooks/hook";
const { Option } = Select;

const status = [
    { value: "shortlisted", label: "Shortlisted" },
    { value: "first interview", label: "First Interview" },
    { value: "second interview", label: "Second Interview" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
]
const TableSearch = () => {

    const dispatch = useAppDispatch();
    const [name, setName] = useState<string>("");
    const [selectedTechnology, setSelectedTechnology] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const handleSearch = () => {
        dispatch(storeSearch(name, selectedTechnology, selectedStatus, selectedLevel));
    }
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Input.Search
                    placeholder="Search candidates..."
                    allowClear
                    enterButton={<Search className="w-4 h-4" />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onSearch={handleSearch}
                    className="w-96"
                />
                <Select
                    placeholder="Filter by Technology"
                    value={selectedTechnology || undefined}
                    onChange={setSelectedTechnology}
                    className="min-w-[200px]"
                >
                    <Option value="React JS">React JS</Option>
                    <Option value="Dotnet">Dot Net</Option>
                    <Option value="DevOps">DevOps</Option>
                    <Option value="QA">QA</Option>
                </Select>

                <Select
                    placeholder="Filter by Level"
                    value={selectedLevel || undefined}
                    onChange={setSelectedLevel}
                    className="min-w-[200px]"
                >
                    <Option value="Junior">Junior</Option>
                    <Option value="Mid">Mid</Option>
                    <Option value="Senior">Senior</Option>
                </Select>

                <Select
                    placeholder="Filter by Status"
                    value={selectedStatus || undefined}
                    onChange={setSelectedStatus}
                    className="min-w-[200px]"
                >
                    {status.map((item) => (
                        <Option key={item.value} value={item.value}>
                            {item.label}
                        </Option>
                    ))}
                </Select>
            </div>
        </div>
    )
}

export default TableSearch
