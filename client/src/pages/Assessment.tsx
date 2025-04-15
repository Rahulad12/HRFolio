import { Button, Card, Modal, Tabs } from "antd";
import { motion } from "framer-motion"
import { Plus, UserPlus } from "lucide-react"
import { useState } from "react";
import AssessmentForm from "../component/Form/AssessmentForm";
import TabPane from "antd/es/tabs/TabPane";
import AssignedAssessments from "../component/Assessment/AssignedAssessments";
import AssessmentsList from "../component/Assessment/AssessmentsList";
import AssignAssessment from "../component/Assessment/AssignAssessment";
const Assessment = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const showAssignModal = () => setIsAssignModalOpen(true);
    const handleAssignCancel = () => setIsAssignModalOpen(false);
    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manage Assessments</h1>
                <div className="space-x-4">
                    <Button
                        icon={<Plus />}
                        onClick={showAssignModal}
                    >
                        Bulk Assign
                    </Button>
                    <Button
                        type="primary"
                        icon={<Plus />}
                        onClick={showModal}
                    >
                        Create Assessment
                    </Button>
                </div>
            </div>
            {/* tabs to select assessment type */}
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Assessment List" key="1">
                    <Card className="flex flex-col gap-4">
                        <AssessmentsList />
                    </Card>
                </TabPane>

                <TabPane tab="Assigned Assessments" key="2">
                    <Card className="bg-white rounded-lg shadow">
                        <AssignedAssessments />
                    </Card>
                </TabPane>
            </Tabs>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
            >
                <Modal
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <AssessmentForm />
                </Modal>
            </motion.div>

            <Modal
                open={isAssignModalOpen}
                onCancel={handleAssignCancel}
                footer={null}
            >
                <AssignAssessment />

            </Modal>
        </div>
    )
}

export default Assessment
