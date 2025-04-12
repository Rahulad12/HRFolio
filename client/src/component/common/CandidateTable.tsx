import { Button, Table } from 'antd';
import { EyeIcon, Trash2 } from 'lucide-react';
import { Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../Hooks/hook';

import { useDeleteCandidateMutation } from '../../services/candidateServiceApi';


interface candidateTable {
    key: string,
    name: string,
    technology: string,
    experience: number,
    status: string
}
interface TableProps {
    loading: boolean
}

const columns = (handleDelete: (id: string) => void) => [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Technology",
        dataIndex: "technology",
        key: "technology",
    },
    {
        title: "Experience",
        dataIndex: "experience",
        key: "experience",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "Action",
        key: "action",
        render: (_: any, record: candidateTable) => (
            <div className="flex items-center gap-1">
                <Button onClick={() => { console.log("View") }}>
                    <EyeIcon className="w-4 h-4 text-blue-600" />
                </Button>
                <Popconfirm
                    title="Are you sure to delete this candidate?"
                    onConfirm={() => handleDelete(record.key)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button>
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </Popconfirm>
            </div>
        ),
    }
];


const CandidateTable = ({ loading }: TableProps) => {
    const [deleteCandidate, { isLoading }] = useDeleteCandidateMutation();

    const ref = useRef(null);
    const candidate = useAppSelector(state => state.candidate.canditate);

    const [data, setData] = useState<candidateTable[]>();

    const handleDelete = async (id: string) => {
        try {
            const res = await deleteCandidate(id).unwrap();
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const dataSource = candidate?.map((item) => {
            return {
                key: item?._id,
                name: item?.name,
                technology: item?.technology,
                experience: item?.experience,
                status: item?.status,
            };
        });
        setData(dataSource);
    }, [candidate]);
    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            {/* <Table ref={ref} dataSource={dataSource} columns={columns} /> */}
            <Table
                ref={ref}
                dataSource={data}
                columns={columns(handleDelete)}
                loading={loading}
                scroll={{ x: "max-content" }}
            />
        </div>
    )
}

export default CandidateTable
