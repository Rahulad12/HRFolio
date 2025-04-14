import { Button, Space, Table, Tag, Tooltip, Popconfirm, Skeleton } from 'antd';
import { Edit, Eye, Mail, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../Hooks/hook';
import { useDeleteCandidateMutation } from '../../services/candidateServiceApi';
import { setCandidate } from '../../slices/candidateSlices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { candidateData } from '../../types';
import { makeCapitilized } from '../../utils/TextAlter';
import { motion, AnimatePresence } from 'framer-motion';

interface TableProps {
    loading: boolean;
    error: boolean;
}

const CandidateTable = ({ loading, error }: TableProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();
    const ref = useRef(null);
    const candidate = useAppSelector((state) => state.candidate.canditate);
    const [data, setData] = useState<candidateData[]>([]);

    const handleDelete = async (id: string) => {
        console.log("candidate Table Rerebder")
        try {
            const res = await deleteCandidate(id).unwrap();
            dispatch(setCandidate([]));
            toast.success(res.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } catch (err: any) {
            toast.error(err?.data?.message || "Error deleting candidate", {
                position: "top-right",
            })
        }
    };

    useEffect(() => {
        setData(candidate || []);
        console.log("candidate table useEffect render")
    }, [candidate]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: candidateData) => (
                <div
                    className="flex flex-col"
                >
                    <span className="font-medium hover:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/dashboard/candidate/${record._id}`)}>
                        {makeCapitilized(text)}
                    </span>
                    <div className="text-xs text-gray-500">
                        <div className="truncate max-w-[180px]">{record.email}</div>
                        <div>{record.phone}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Technology',
            dataIndex: 'technology',
            key: 'technology',
            render: (tech: string) => (
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <Tag color="blue" className="capitalize">
                        {makeCapitilized(tech)}
                    </Tag>
                </motion.div>
            ),
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => {
                const colorMap: { [key: string]: string } = {
                    junior: 'green',
                    mid: 'orange',
                    senior: 'purple',
                };
                return (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Tag color={colorMap[level] || 'default'} className="capitalize">
                            {makeCapitilized(level)}
                        </Tag>
                    </motion.div>
                );
            },
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
            render: (exp: number) => (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {`${exp} ${exp === 1 ? 'year' : 'years'}`}
                </motion.div>
            ),
            sorter: (a: candidateData, b: candidateData) => a.experience - b.experience,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colorMap: { [key: string]: string } = {
                    Shortlisted: 'cyan',
                    'first interview': 'purple',
                    'second interview': 'geekblue',
                    Hired: 'green',
                    Rejected: 'red',
                };
                return (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Tag color={colorMap[status] || 'default'} className="capitalize">
                            {makeCapitilized(status)}
                        </Tag>
                    </motion.div>
                );
            },
        },
        {
            title: 'Expected Salary',
            dataIndex: 'expectedsalary',
            key: 'expectedsalary',
            render: (salary: number) => (
                <motion.span
                    className="font-medium"
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                >
                    ${salary?.toLocaleString('en-US') || '0'}
                </motion.span>
            ),
            sorter: (a: candidateData, b: candidateData) => a.expectedsalary - b.expectedsalary,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_: any, record: candidateData) => (
                <Space size="small">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="View Details">
                            <Button
                                type="text"
                                icon={<Eye className="w-4 h-4" />}
                                onClick={() => navigate(`/dashboard/candidate/${record._id}`)}
                                className="text-blue-500 hover:bg-blue-50"
                            />
                        </Tooltip>
                    </motion.div>
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
                        <Tooltip title="Send Email">
                            <Button
                                type="text"
                                icon={<Mail className="w-4 h-4" />}
                                onClick={() => console.log('Send Email', record._id)}
                                className="text-purple-500 hover:bg-purple-50"
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

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-white rounded-lg shadow overflow-hidden"
            >
                <AnimatePresence>
                    <Table
                        ref={ref}
                        dataSource={data}
                        rowKey="_id"
                        columns={columns}
                        loading={loading}
                        size='small'
                        sortDirections={['ascend', 'descend', 'ascend']}
                        pagination={{
                            total: data.length,
                            pageSize: 5,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '20', '50'],
                            showTotal: (total) => (
                                <motion.span
                                    className="text-gray-600"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Showing <b>{Math.min(5, total)}</b> of <b>{total}</b> candidates
                                </motion.span>
                            ),
                        }}
                        className="antd-table-custom"
                        rowClassName="hover:bg-gray-50 transition-colors"
                        components={{
                            body: {
                                row: ({ children, ...props }) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        {...props}
                                    >
                                        {children}
                                    </motion.tr>
                                )
                            }
                        }}
                    />
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default CandidateTable;