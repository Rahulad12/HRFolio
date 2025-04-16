import { Button, notification, Popconfirm, Select, Table, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import { EditOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../../Hooks/hook'
import { makeCapitilized } from '../../utils/TextAlter'
import { Trash2 } from 'lucide-react'
import { AssessmentDataResponse } from '../../types'
import { useCreateAssignAssessmentMutation, useDeleteAssessmentMutation } from '../../services/assessmentServiceApi'
import { storeAssessment, storeAssignedAssessment } from '../../action/StoreAssessment'
const AssessmentsList = () => {
    const dispatch = useAppDispatch();

    const { assessments } = useAppSelector(state => state.assessments);
    const { canditate } = useAppSelector(state => state.candidate);

    const [api, contextHolder] = notification.useNotification();

    const [createAssignAssessment] = useCreateAssignAssessmentMutation();

    const [deleteAssessment] = useDeleteAssessmentMutation();


    const handleEditAssessment = () => {

    }
    const handleDeleteAssessment = async (id: string) => {
        try {
            const res = await deleteAssessment(id);
            if (res?.data && res?.data?.success) {
                dispatch(storeAssessment(Array.from(res?.data.data)));
                api.success({
                    message: res.data?.message,
                    placement: "top",
                    duration: 3000,
                })
            }

        } catch (error: any) {
            api.error({
                message: error?.data?.message || "Error deleting assessment",
                placement: "top",
                duration: 3000,
            })
        }

    }

    const handleAssignAssessment = async (candidateId: string, assessmnetId: string) => {
        try {
            const res = await createAssignAssessment({ candidate: [candidateId], assessment: assessmnetId }).unwrap();
            if (res?.data) {
                dispatch(storeAssignedAssessment(res?.data));
                api.success({
                    message: res.message,
                    placement: "top",
                    duration: 3000,
                })
            }
        } catch (error: any) {
            api.error({
                message: error?.data?.message || "Error assigning assessment",
                placement: "top",
                duration: 3000,
            })
        }
    }

    const columns = [
        {
            title: 'Assessment',
            dataIndex: 'title',
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
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AssessmentDataResponse) => (
                <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Edit Assessment" placement="top">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => handleEditAssessment()}
                            />
                        </Tooltip>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Delete Assessment" placement="top">
                            <Popconfirm
                                title="Delete this candidate?"
                                description="Are you sure you want to delete this candidate record?"
                                onConfirm={() => handleDeleteAssessment(record._id)}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{ loading: false }}
                            >
                                <Button
                                    type="text"
                                    danger
                                    icon={<Trash2 className="w-4 h-4" />}
                                />
                            </Popconfirm>
                        </Tooltip>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Tooltip title="Assign Assessment" placement="top">
                            <Select
                                placeholder="Select candidates"
                                onChange={(value) => {
                                    handleAssignAssessment(value, record._id)
                                }}
                                style={{ width: 150 }}
                            >
                                {
                                    canditate.map(c => (
                                        <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
                                    ))
                                }
                            </Select>
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
                    dataSource={assessments}
                    size='small'
                    className="antd-table-custom"
                />
            </motion.div>

        </div>
    )
}

export default AssessmentsList
