import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Download, Eye, Pencil, Send, } from 'lucide-react';
import { offerLetters, candidates } from '../../data/mockData';
import { OfferLetter } from '../../types';
import { motion } from 'framer-motion';
import PrimaryButton from '../../component/ui/button/Primary';
import { Button, Card, Badge, Input, Select } from 'antd';
import CustomTable from '../../component/common/Table';

const OfferList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();

  // Combine offer data with candidate names
  const offersWithNames = offerLetters.map(offer => {
    const candidate = candidates.find(c => c.id === offer.candidateId);

    return {
      ...offer,
      candidateName: candidate?.name || 'Unknown',
      email: candidate?.email || 'unknown@example.com'
    };
  });

  const filteredOffers = offersWithNames.filter(offer => {
    const matchesSearch =
      offer.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || offer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewCandidate = (offer: typeof offersWithNames[0]) => {
    navigate(`/dashboard/candidates/${offer.candidateId}`);
  };

  const handleEditOffer = (offer: typeof offersWithNames[0]) => {
    navigate(`/dashboard/offers/edit/${offer.id}`);
  };

  const handleSendOffer = (offer: typeof offersWithNames[0], e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, we would send the offer here
    alert(`Send offer to: ${offer.candidateName}`);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'negotiating', label: 'Negotiating' }
  ];

  const getStatusBadge = (status: OfferLetter['status']) => {
    switch (status) {
      case 'draft':
        return <Badge typeof='warning'>Draft</Badge>;
      case 'sent':
        return <Badge typeof="info">Sent</Badge>;
      case 'accepted':
        return <Badge typeof="success">Accepted</Badge>;
      case 'rejected':
        return <Badge typeof="error">Rejected</Badge>;
      case 'negotiating':
        return <Badge typeof="warning">Negotiating</Badge>;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Candidate',
      render: (offer: typeof offersWithNames[0]) => (
        <div>
          <div className="font-medium text-gray-900">{offer.candidateName}</div>
          <div className="text-xs text-gray-500">{offer.email}</div>
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
      render: (offer: typeof offersWithNames[0]) => getStatusBadge(offer.status)
    },
    {
      title: 'Actions',
      render: (offer: typeof offersWithNames[0]) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            size='small'
            onClick={() => handleViewCandidate(offer)}
            aria-label="View candidate"
          >
            <Eye size={16} className="text-blue-600" />
          </Button>
          {offer.status === 'draft' && (
            <>
              <Button
                type='text'
                size="small"
                className="p-1"
                onClick={() => handleEditOffer(offer)}
                aria-label="Edit offer"
              >
                <Pencil size={16} className="text-blue-600" />
              </Button>
              <Button
                type="text"
                size="small"
                className="p-1"
                onClick={(e) => handleSendOffer(offer, e)}
                aria-label="Send offer"
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
          data={filteredOffers}
          columns={columns}
          loading={false}
          pageSize={5}
        />
      </Card>
    </motion.div>
  );
};

export default OfferList;