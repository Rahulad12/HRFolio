import { useAppSelector } from '../../Hooks/hook';
import Button from '../ui/Button';
import { ArrowLeft, Calendar, Mail, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { makeCapitilized } from '../../utils/TextAlter';

const CandidateProfile = () => {
    const navigate = useNavigate();
    const { candidate } = useAppSelector((state) => state.candidate);
    const profile = candidate?.[0];

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    icon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/dashboard/candidates')}
                    aria-label="Back"
                />
                <div>
                    <h1 className="text-2xl font-bold mb-6">{makeCapitilized(profile?.name)}</h1>
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
                        <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {profile?.email}
                        </span>
                        <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {profile?.phone}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
