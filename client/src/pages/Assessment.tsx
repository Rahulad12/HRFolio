import { Modal } from "antd";
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import AssessmentForm from "../component/Assessment/AssessmentForm";
import { useGetAssessmentQuery } from "../services/assessmentServiceApi";
import { storeAssessment } from "../action/StoreAssessment";
import { useAppDispatch } from "../Hooks/hook";
import { getCandidate } from "../action/SoreCandidate";
import AssessmentsList from "../component/Assessment/AssessmentsList";
import Hero from "../component/common/Hero";
import { buttonState } from "../slices/ButtonPropsSlices";

const Assessment = () => {
    getCandidate(); // this function helps to get the data from store so i cannot have to store again and again

    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: assessment } = useGetAssessmentQuery();

    useEffect(() => {
        if (assessment?.data) {
            dispatch(storeAssessment(assessment?.data));
        }
        dispatch(buttonState({ text: "Create Assessment", icon: <Plus className="w-4 h-4" />, onClick: showModal }));
    }, [assessment,dispatch]);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    return (
        <div className="p-4 flex flex-col gap-4">
            <Hero title="Assessments" />
            {/* tabs to select assessment type */}
            <AssessmentsList />
            {/* modal to create assessment */}
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
        </div>
    )
}

export default Assessment
