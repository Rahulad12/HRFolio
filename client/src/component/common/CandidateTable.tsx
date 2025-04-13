import { Button, Space, Table, Tag, Tooltip, Popconfirm } from 'antd';
import { Edit, Eye, Mail, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../Hooks/hook';
import { useDeleteCandidateMutation } from '../../services/candidateServiceApi';
import { setCandidate } from '../../slices/candidateSlices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { candidateData } from '../../types';
import { makeCapitilized } from '../../utils/TextAlter';

interface TableProps {
    loading: boolean;
    error: boolean;

}
const CandidateTable = ({ loading, error }: TableProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [deleteCandidate] = useDeleteCandidateMutation();
    const ref = useRef(null);
    const candidate = useAppSelector((state) => state.candidate.canditate);
    const [data, setData] = useState<candidateData[]>([]);


    const handleDelete = async (id: string) => {
        try {
            const res = await deleteCandidate(id).unwrap();
            dispatch(setCandidate([]));
            toast.success(res.message);
        } catch (err: any) {
            toast.error(err?.data?.message || "Error deleting candidate");
        }
    };

    useEffect(() => {
        setData(candidate || []);
    }, [candidate]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: candidateData) => (
                <div className="flex flex-col">
                    <span className="font-medium">{makeCapitilized(text)}</span>
                    <div className="text-xs text-gray-500">
                        <div>{record.email}</div>
                        <div>{record.phone}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Technology',
            dataIndex: 'technology',
            key: 'technology',
            render: (tech: string) => <Tag color="blue">{makeCapitilized(tech)}</Tag>,
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => {
                const colorMap: { [key: string]: string } = {
                    Junior: 'green',
                    Mid: 'orange',
                    Senior: 'purple',
                };
                return <Tag color={colorMap[level] || 'default'}>{makeCapitilized(level)}</Tag>;
            },
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
            render: (exp: number) => `${exp} years`,
            sorter: (a: candidateData, b: candidateData) => a.experience - b.experience,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colorMap: { [key: string]: string } = {
                    Shortlisted: 'cyan',
                    'First Interview': 'purple',
                    'Second Interview': 'geekblue',
                    Hired: 'green',
                    Rejected: 'red',
                };
                return <Tag color={colorMap[status] || 'default'}>{makeCapitilized(status)}</Tag>;
            },
        },
        {
            title: 'Expected Salary',
            dataIndex: 'expectedsalary',
            key: 'expectedsalary',
            render: (salary: number) => `$${salary?.toLocaleString() || 0}`,
            sorter: (a: candidateData, b: candidateData) =>
                a.expectedsalary - b.expectedsalary,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: candidateData) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => navigate(`/dashboard/candidate/${record._id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<Edit className="w-4 h-4" />}
                            onClick={() => navigate(`/dashboard/candidate/edit/${record._id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Send Email">
                        <Button
                            type="text"
                            icon={<Mail className="w-4 h-4" />}
                            onClick={() => console.log('Send Email', record._id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure to delete this candidate?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="text" danger icon={<Trash2 className="w-4 h-4" />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];



    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            {
                error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex gap-1" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline">No Any Data Found </span>

                    </div>
                ) : (
                    <Table
                        ref={ref}
                        dataSource={data}
                        rowKey="_id"
                        columns={columns}
                        loading={loading}
                        pagination={{
                            total: data.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} candidates`,
                        }}
                        className="rounded-lg overflow-hidden"
                    />
                )



            }

        </div>
    );



};

export default CandidateTable;
