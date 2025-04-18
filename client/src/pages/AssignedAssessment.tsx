import { Modal } from "antd";
import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import AssignAssessmentForm from "../component/Assessment/AssignAssessmentForm";
import { useGetAssignedAssessmentQuery, useGetAssessmentByIdQuery, useGetAssessmentQuery } from "../services/assessmentServiceApi";
import { storeAssessment, storeAssignedAssessment } from "../action/StoreAssessment";
import { useAppDispatch } from "../Hooks/hook";
import { getCandidate } from "../action/SoreCandidate";
import PrimaryButton from "../component/ui/button/Primary";
import AssignedAssessments from "../component/Assessment/AssignedAssessments";

const AssignedAssessment = () => {
    getCandidate(); // this function helps to get the data from store so i cannot have to store again and again

    const dispatch = useAppDispatch();
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const { data: assignedAssessment } = useGetAssignedAssessmentQuery();
    const { data: assessment } = useGetAssessmentQuery();

    useEffect(() => {
        if (assignedAssessment?.data) {
            dispatch(storeAssignedAssessment(assignedAssessment?.data));
        }
        if (assessment?.data) {
            dispatch(storeAssessment(assessment?.data));
        }
    }, [assignedAssessment, assessment]);


    const showAssignModal = () => setIsAssignModalOpen(true);
    const handleAssignCancel = () => setIsAssignModalOpen(false);


    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Assigned Assessments</h1>
                <div className="space-x-4">
                    <PrimaryButton text="Assign Assessment" icon={<Plus className="w-4 h-4" />} onClick={showAssignModal} />
                </div>
            </div>
            {/* tabs to select assessment type */}

            <AssignedAssessments />
            {/* modal to create assessment */}


            <Modal
                open={isAssignModalOpen}
                onCancel={handleAssignCancel}
                footer={null}
            >
                <AssignAssessmentForm />

            </Modal>
        </div>
    )
}

export default AssignedAssessment
