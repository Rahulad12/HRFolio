import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Download, Eye, Pencil, Send, } from 'lucide-react';
import { offerLetter } from '../../types';
import { motion } from 'framer-motion';
import PrimaryButton from '../../component/ui/button/Primary';
import { Button, Card, Input, message, Select } from 'antd';
import CustomTable from '../../component/common/Table';
import { useGetOfferLetterQuery, useCreateOfferLetterMutation } from '../../services/offerService';
import Badge from '../../component/ui/Badge';

const OfferList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sendingOfferId, setSendingOfferId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: offerLetters, isLoading: isLoadingOfferLetter, refetch } = useGetOfferLetterQuery();
  const [createOfferLetter, { isLoading: offerSending }] = useCreateOfferLetterMutation();


  const filteredOffers = offerLetters?.data?.filter(offer => {
    const matchesSearch =
      offer?.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer?.position?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || offer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewCandidate = (offer: offerLetter) => {
    navigate(`/dashboard/candidates/${offer?.candidate?._id}`);
  };

  const handleEditOffer = (offer: offerLetter) => {
    navigate(`/dashboard/offers/edit/${offer?._id}`);
  };

  const handleSendOffer = async (offer: offerLetter) => {

    if (!offer.position || !offer.salary || !offer.startDate || !offer.responseDeadline || !offer.email) {
      message.warning("Incomplete offer. Please edit and complete the draft first.");
      return;
    }
    const payload = {
      candidate: offer?.candidate?._id,
      email: offer?.email,
      position: offer?.position,
      salary: offer?.salary,
      startDate: offer?.startDate,
      responseDeadline: offer?.responseDeadline,
      status: 'sent'
    }
    try {
      const res = await createOfferLetter(payload).unwrap();
      if (res?.success) {
        message.success(res?.message);
        refetch();
      }
    } catch (error: any) {
      console.error('Failed to send offer', error);
      message.error(error?.data?.message);
    }
    finally {
      setSendingOfferId(null);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'negotiating', label: 'Negotiating' }
  ];

  const getStatusBadge = (status: offerLetter['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant='warning'>Draft</Badge>;
      case 'sent':
        return <Badge variant="info">Sent</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Candidate',
      render: (_: any, record: offerLetter) => (
        <div>
          <div className="font-medium text-gray-900 capitalize">{record?.candidate?.name}</div>
          <div className="text-xs text-gray-500 capitalize">{record?.candidate?.email}</div>
        </div>
      )
    },
    {
      title: 'Position',
      dataIndex: 'position',
      Key: 'position'
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      Key: 'salary'
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate'
    },
    {
      title: 'Status',
      render: (offer: offerLetter) => getStatusBadge(offer?.status as offerLetter['status'])
    },
    {
      title: 'Actions',
      render: (_: any, offer: offerLetter) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            size='small'
            onClick={() => handleViewCandidate(offer)}
            aria-label="View candidate"
            disabled={offerSending}
          >
            <Eye size={16} className="text-blue-600" />
          </Button>
          {offer?.status === 'draft' && (
            <>
              <Button
                type='text'
                size="small"
                className="p-1"
                onClick={() => handleEditOffer(offer)}
                aria-label="Edit offer"
                disabled={offerSending}
              >
                <Pencil size={16} className="text-blue-600" />
              </Button>
              <Button
                type="text"
                size="small"
                className="p-1"
                onClick={() => handleSendOffer(offer)}
                aria-label="Send offer"
                loading={sendingOfferId === offer._id}
              >
                <Send size={16} className="text-green-600" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Letters</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage offer letters for candidates
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <PrimaryButton
            text="New Offer"
            icon={<FileText size={16} />}
            onClick={() => navigate('/dashboard/offers/new')}
          />
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <Input
              placeholder="Search offers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search size={18} className="text-gray-400" />}
            />
          </div>
          <div className="flex space-x-2">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
            <Button
              type="default"
              icon={<Filter size={16} />}
              aria-label="More filters"
            >
              Filters
            </Button>
            <Button
              type="default"
              icon={<Download size={16} />}
              aria-label="Export"
            >
              Export
            </Button>
          </div>
        </div>

        <CustomTable
          data={filteredOffers || []}
          columns={columns}
          loading={isLoadingOfferLetter}
          pageSize={5}
        />
      </Card>
    </motion.div>
  );
};

export default OfferList;