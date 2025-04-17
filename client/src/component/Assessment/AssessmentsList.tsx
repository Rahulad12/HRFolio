import { Button, notification, Popconfirm, Table, Tooltip, Modal } from 'antd'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../Hooks/hook'
import { makeCapitilized } from '../../utils/TextAlter'
import { Edit, Trash2 } from 'lucide-react'
import { AssessmentDataResponse, assessmentFormData } from '../../types'
import { useDeleteAssessmentMutation } from '../../services/assessmentServiceApi'
import { storeAssessment } from '../../action/StoreAssessment'
import EditAssessment from '../Form/Edit/EditAssessment'
import { useState } from 'react'
import { useUpdateAssessmentMutation } from "../../services/assessmentServiceApi";
const AssessmentsList = () => {
    const dispatch = useAppDispatch();

    const { assessments } = useAppSelector(state => state.assessments);

    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [assessmentId, setAssessmentId] = useState<string>("");
    const showModal = (id: string) => {
        setIsModalOpen(true);
        setAssessmentId(id);
    }
    const handleCancel = () => setIsModalOpen(false);


    const [deleteAssessment] = useDeleteAssessmentMutation();
    const [updateAssessment] = useUpdateAssessmentMutation();
    const handleEditAssessment = async (value: assessmentFormData) => {
        try {
            const res = await updateAssessment({ id: assessmentId, data: value });
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
                message: error?.data?.message || "Error updating assessment",
                placement: "top",
                duration: 3000,
            })
        }
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
                <div className="flex flex-col gap-2">

                    <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <Tooltip title="Edit Assessment" placement="top">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    type="default"
                                    icon={<Edit className='w-4 h-4' />}
                                    onClick={() => showModal(record._id)}
                                    size="small"
                                />
                            </motion.div>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Delete Assessment" placement="top">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Popconfirm
                                    title="Delete this assessment?"
                                    description="Are you sure you want to delete this assessment?"
                                    onConfirm={() => handleDeleteAssessment(record._id)}
                                    okText="Yes"
                                    cancelText="No"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button
                                        danger
                                        type="default"
                                        icon={<Trash2 className="w-4 h-4" />}
                                        size="small"
                                    />
                                </Popconfirm>
                            </motion.div>
                        </Tooltip>
                    </div>

                </div>
            ),
        }

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
                    dataSource={Array.isArray(assessments) ? assessments : []}
                    size="middle"
                    rowKey="_id"
                    className="antd-table-custom"
                    pagination={{
                        pageSize: 3,
                    }}
                />
                <Modal
                    onCancel={handleCancel}
                    open={isModalOpen}
                    footer={null}
                >
                    <EditAssessment handleEdit={handleEditAssessment} id={assessmentId} />
                </Modal>
            </motion.div>
        </div>
    )
}

export default AssessmentsList
