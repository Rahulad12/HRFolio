import { useEffect, useState } from "react";
import { Modal, Card } from "antd";
import { DiamondPercent, UserPlus } from "lucide-react";
import CandidateForm from "../component/candidate/CandidateForm";
import { useGetCandidateQuery } from "../services/candidateServiceApi";
import { useAppDispatch, useAppSelector } from "../Hooks/hook";
import { storeCandidate } from "../action/SoreCandidate";
import CandidateTable from "../component/candidate/CandidateTable";
import TableSearch from "../component/common/TableSearch";
import PrimaryButton from "../component/ui/button/Primary";
import { buttonState } from '../slices/ButtonPropsSlices';
import Hero from "../component/common/Hero";


const CvUploader = () => {
    const filters = useAppSelector((state) => state.search);

    const { isLoading, data: candidate, isError, refetch } = useGetCandidateQuery({
        name: filters.name,
        technology: filters.technology,
        status: filters.status,
        level: filters.level
    });

    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    useEffect(() => {
        if (candidate?.data) {
            dispatch(storeCandidate(candidate.data));
            refetch();
        }
        dispatch(buttonState({ text: "Add Candidate", icon: <UserPlus className="w-4 h-4" />, onClick: { showModal } }));
        return () => {
            dispatch(storeCandidate([]));
        };

    }, [candidate, dispatch, refetch]);

    return (
        <div className="p-4 flex flex-col gap-4">
            <Hero title="Candidates" />

            <Card className="flex flex-col gap-4">
                <TableSearch />
            </Card>

            {/* Table component  */}
            <CandidateTable loading={isLoading} error={isError} />

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={800}
                destroyOnClose
            >
                <CandidateForm />
            </Modal>
        </div>
    );
};

export default CvUploader;
