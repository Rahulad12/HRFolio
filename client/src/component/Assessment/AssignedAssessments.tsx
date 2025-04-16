import { Button, Table } from 'antd'
import { motion } from 'framer-motion'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useAppSelector } from '../../Hooks/hook'
import { Trash2 } from 'lucide-react'
import { makeCapitilized } from '../../utils/TextAlter'
import type { Dayjs } from 'dayjs'

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

    const { assignedAssessments } = useAppSelector(state => state.assessments);
    const filterAssigned = assignedAssessments?.filter(item => item.assessment !== null);
    const handleEditAssessment = () => {

    }
    const handleDeleteAssessment = () => {

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
            title: 'Start Date',
            dataIndex: 'date',
            key: 'startDate',
            render: (text: string) => (
                <div className='flex gap-2'>
                    <span>{makeCapitilized(text)}</span>
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
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditAssessment()}
                        />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            type="text"
                            danger
                            icon={<Trash2 className='w-4 h-4' />}
                            onClick={() => handleDeleteAssessment()}
                        />
                    </motion.div>
                </div>
            ),
        },

    ]

    return (
        <div>
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
                        assessment: item.assessment?.assessment,
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
