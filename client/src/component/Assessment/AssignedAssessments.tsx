import { Button, notification, Popconfirm, Table, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import { EditOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../../Hooks/hook'
import { Trash2 } from 'lucide-react'
import { makeCapitilized } from '../../utils/TextAlter'
import dayjs, { Dayjs } from 'dayjs'
import { useDeleteAssignmentMutation } from '../../services/assessmentServiceApi'
import { storeAssignedAssessment } from '../../action/StoreAssessment'

interface FlattenedAssessment {
    key: string;
    assessment: string;
    type: string;
    technology: string;
    level: string;
    status: string;
    date: Dayjs;
    candidate: string;
}

const AssignedAssessments = () => {
    const dispatch = useAppDispatch();

    const { assignedAssessments } = useAppSelector(state => state.assessments);
    const filterAssigned = assignedAssessments?.filter(item => item.assessment !== null);
    const [api, contextHolder] = notification.useNotification();
    const [deleteAssignment] = useDeleteAssignmentMutation();
    const handleEditAssessment = () => {

    }
    const handleDeleteAssessment = async (id: string) => {
        try {
            const res = await deleteAssignment(id);
            if (res.data && res?.data?.success) {
                dispatch(storeAssignedAssessment(Array.from(res?.data?.data)));
                api.success({
                    message: `${res?.data?.message}`,
                    placement: "top",
                    duration: 3000,
                })
            }

        } catch (error: any) {
            api.error({
                message: `${error?.data?.message}`,
                placement: "top",
                duration: 3000,
            })
        }
    }
    const columns = [
        {
            title: 'Assessment',
            dataIndex: 'assessment',
            key: 'assessment',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Technology',
            dataIndex: 'technology',
            key: 'technology',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },


        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                </div>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text: Dayjs) => (
                <div className='flex gap-2'>
                    <span>{dayjs(text).format('YYYY-MM-DD')}</span>
                </div>
            )
        },
        {
            title: 'Candidate',
            dataIndex: 'candidate',
            key: 'candidate',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
                    {/* <span>{makeCapitilized(record)}</span> */}
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: FlattenedAssessment) => (
                <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Edit">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => handleEditAssessment()}
                            />
                        </Tooltip>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Delete">
                            <Popconfirm
                                title="Delete this assignment?"
                                description="Are you sure you want to delete, This action cannot be undone."
                                okButtonProps={{ danger: true }}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => handleDeleteAssessment(record.key)}
                            >
                                <Button
                                    type="text"
                                    danger
                                    icon={<Trash2 className='w-4 h-4' />}
                                />
                            </Popconfirm>

                        </Tooltip>
                    </motion.div>
                </div>
            ),
        },

    ]

    return (
        <div>
            {contextHolder}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-white rounded-lg shadow overflow-hidden"
            >
                <Table
                    columns={columns}
                    dataSource={filterAssigned?.map((item, index): FlattenedAssessment => ({
                        key: item._id || index.toString(),
                        assessment: item.assessment?.title,
                        technology: item.assessment?.technology,
                        level: item.assessment?.level,
                        type: item.assessment?.type,
                        status: item.status,
                        date: item.date,
                        candidate: `${item.candidate?.name} ${item.candidate?.email}`,
                    }))}

                    size='small'
                    className="antd-table-custom"
                />
            </motion.div>

        </div>
    )
}

export default AssignedAssessments
