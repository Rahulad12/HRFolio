import { Modal } from "antd";
import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import AssignAssessmentForm from "../component/Assessment/AssignAssessmentForm";
import { useGetAssignedAssessmentQuery, useGetAssessmentQuery } from "../services/assessmentServiceApi";
import { storeAssessment, storeAssignedAssessment } from "../action/StoreAssessment";
import { useAppDispatch } from "../Hooks/hook";
import { getCandidate } from "../action/SoreCandidate";
import AssignedAssessments from "../component/Assessment/AssignedAssessments";
import Hero from "../component/common/Hero";
import { buttonState } from "../slices/ButtonPropsSlices";

const AssignedAssessment = () => {
    getCandidate(); // this function helps to get the data from store so i cannot have to store again and again

    const dispatch = useAppDispatch();
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const { data: assignedAssessment } = useGetAssignedAssessmentQuery();
    const { data: assessment } = useGetAssessmentQuery();

    const showModal = () => setIsAssignModalOpen(true);
    const handleCancel = () => setIsAssignModalOpen(false);

    useEffect(() => {
        if (assignedAssessment?.data) {
            dispatch(storeAssignedAssessment(assignedAssessment?.data));
        }
        if (assessment?.data) {
            dispatch(storeAssessment(assessment?.data));
        }
        dispatch(buttonState({ text: "Assigned Assessment", icon: <Plus className="w-4 h-4" />, onClick: showModal }));
    }, [assignedAssessment, assessment, dispatch]);



    return (
        <div className="p-4 flex flex-col gap-4">
            <Hero title="Assigned Assessment" />
            {/* tabs to select assessment type */}

            <AssignedAssessments />
            {/* modal to create assessment */}


            <Modal
                open={isAssignModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <AssignAssessmentForm />

            </Modal>
        </div>
    )
}

export default AssignedAssessment
