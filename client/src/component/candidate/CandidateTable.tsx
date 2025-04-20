import { Button, Space, Tag, Tooltip, Popconfirm, Skeleton, notification } from 'antd';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../Hooks/hook';
import { useDeleteCandidateMutation } from '../../services/candidateServiceApi';
import { setCandidate } from '../../slices/candidateSlices';
import { useNavigate } from 'react-router-dom';
import { candidateData } from '../../types';
import { makeCapitilized } from '../../utils/TextAlter';
import { motion, AnimatePresence } from 'framer-motion';
import type { TableColumnsType } from 'antd';
import CustomTable from '../common/Table';

interface TableProps {
    loading: boolean;
    error: boolean;
}

const statusColors: Record<string, string> = {
    shortlisted: 'blue',
    'first interview': 'orange',
    'second interview': 'purple',
    hired: 'green',
    rejected: 'red',
};

const CandidateTable = ({ loading, error }: TableProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();
    const candidate = useAppSelector((state) => state.candidate.candidate);
    const [data, setData] = useState<candidateData[]>([]);
    const [api, contextHolder] = notification.useNotification();
    const handleDelete = async (id: string) => {
        try {
            const res = await deleteCandidate(id).unwrap();
            dispatch(setCandidate([]));
            api.success({
                message: res.message,
                placement: "topRight",
                duration: 3000,
            })
        } catch (err: any) {
            api.error({
                message: err?.data?.message || "Error deleting candidate",
                placement: "topRight",
                duration: 3000,
            })
        }
    };

    useEffect(() => {
        setData(candidate || []);
    }, [candidate]);

    const columns: TableColumnsType<candidateData> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: candidateData) => (
                <span className="font-semibold hover:text-blue-600 cursor-pointer"
                    onClick={() => navigate(`/dashboard/candidate/${record._id}`)}>
                    {makeCapitilized(text)}
                </span>
            ),
        },
        {
            title: 'Technology',
            dataIndex: 'technology',
            key: 'technology',
            render: (tech: string) => (
                <span>
                    {makeCapitilized(tech)}
                </span>
            ),
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => {
                return (
                    <span>
                        {makeCapitilized(level)}
                    </span>
                );
            },
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
            render: (exp: number) => (
                <span>
                    {`${exp} ${exp === 1 ? 'year' : 'years'}`}
                </span>
            ),
            sorter: (a: candidateData, b: candidateData) => a.experience - b.experience,
        },

        {
            title: 'Expected Salary',
            dataIndex: 'expectedsalary',
            key: 'expectedsalary',
            render: (salary: number) => (
                <span
                >
                    ${salary?.toLocaleString('en-US') || '0'}
                </span>
            ),
            sorter: (a: candidateData, b: candidateData) => a.expectedsalary - b.expectedsalary,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={statusColors[status.toLowerCase()] || 'default'}>
                    {makeCapitilized(status)}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_: any, record: candidateData) => (
                <Space size="small">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Edit">
                            <Button
                                type="text"
                                icon={<Edit className="w-4 h-4" />}
                                onClick={() => navigate(`/dashboard/candidate/edit/${record._id}`)}
                                className="text-green-500 hover:bg-green-50"
                            />
                        </Tooltip>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Delete">
                            <Popconfirm
                                title="Delete this candidate?"
                                description="Are you sure you want to delete this candidate record?"
                                onConfirm={() => handleDelete(record._id)}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{ loading: isDeleting }}
                            >
                                <Button
                                    type="text"
                                    danger
                                    icon={<Trash2 className="w-4 h-4" />}
                                    className="hover:bg-red-50"
                                />
                            </Popconfirm>
                        </Tooltip>
                    </motion.div>
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow p-4"
            >
                <Skeleton
                    active
                    paragraph={{ rows: 8 }}
                />
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className='flex justify-center items-center text-gray-600 shadow p-4 text-sm'
            >
                <span>No candidate data found</span>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                </motion.div>
            </motion.div>
        );
    }
    //main content return
    return (
        <>
            {contextHolder}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-white rounded-lg shadow overflow-hidden"
            >
                <AnimatePresence>
                    <CustomTable
                        loading={loading}
                        data={data}
                        columns={columns}
                        pageSize={5}
                    />
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default CandidateTable;