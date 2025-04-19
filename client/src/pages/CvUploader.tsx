import { useEffect, useState } from "react";
import { Card, Modal } from "antd";
import { UserPlus } from "lucide-react";
import CandidateForm from "../component/candidate/CandidateForm";
import { useGetCandidateQuery } from "../services/candidateServiceApi";
import { useAppDispatch, useAppSelector } from "../Hooks/hook";
import { storeCandidate } from "../action/SoreCandidate";
import CandidateTable from "../component/candidate/CandidateTable";
import TableSearch from "../component/common/TableSearch";
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
    console.log(isModalOpen);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);


    useEffect(() => {

        if (candidate?.data) {
            dispatch(storeCandidate(candidate.data));
            refetch();
        }
        dispatch(buttonState({ text: "Add Candidate", icon: <UserPlus className="w-4 h-4" />, onClick: showModal }));
        return () => {
            dispatch(storeCandidate([]));
        };

    }, [candidate, dispatch]);

    return (
        <div className="p-4 flex flex-col gap-4">
            <Hero title="Candidates" />
            <Card extra={<TableSearch />}>
                <CandidateTable loading={isLoading} error={isError} />
            </Card>


            {/* Table component  */}

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
