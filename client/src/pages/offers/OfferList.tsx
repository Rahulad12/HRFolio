import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Download, Eye, Pencil, Send } from 'lucide-react';
import { offerLetters, candidates } from '../../data/mockData';
import Card from '../../component/ui/Card';
import Button from '../../component/ui/Button';
import Table from '../../component/ui/Table';
import Badge from '../../component/ui/Badge';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import { OfferLetter } from '../../types';
import { motion } from 'framer-motion';

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
    navigate(`/candidates/${offer.candidateId}`);
  };

  const handleEditOffer = (offer: typeof offersWithNames[0], e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/offers/edit/${offer.id}`);
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
        return <Badge variant="primary">Draft</Badge>;
      case 'sent':
        return <Badge variant="info">Sent</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'negotiating':
        return <Badge variant="warning">Negotiating</Badge>;
      default:
        return null;
    }
  };

  const columns = [
    {
      header: 'Candidate',
      accessor: (offer: typeof offersWithNames[0]) => (
        <div>
          <div className="font-medium text-gray-900">{offer.candidateName}</div>
          <div className="text-xs text-gray-500">{offer.email}</div>
        </div>
      )
    },
    {
      header: 'Position',
      accessor: 'position'
    },
    {
      header: 'Salary',
      accessor: 'salary'
    },
    {
      header: 'Start Date',
      accessor: 'startDate'
    },
    {
      header: 'Status',
      accessor: (offer: typeof offersWithNames[0]) => getStatusBadge(offer.status)
    },
    {
      header: 'Actions',
      accessor: (offer: typeof offersWithNames[0]) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => handleViewCandidate(offer)}
            aria-label="View candidate"
          >
            <Eye size={16} className="text-blue-600" />
          </Button>
          {offer.status === 'draft' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={(e) => handleEditOffer(offer, e)}
                aria-label="Edit offer"
              >
                <Pencil size={16} className="text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
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
          <Button
            variant="primary"
            icon={<FileText size={16} />}
            onClick={() => navigate('/offers/new')}
          >
            Create Offer Letter
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/email-templates')}
          >
            Manage Templates
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              placeholder="Search offers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
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
              variant="outline"
              icon={<Filter size={16} />}
              aria-label="More filters"
            >
              Filters
            </Button>
            <Button
              variant="outline"
              icon={<Download size={16} />}
              aria-label="Export"
            >
              Export
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredOffers}
          keyExtractor={(offer) => offer.id}
          onRowClick={handleViewCandidate}
          emptyMessage="No offers found. Try adjusting your filters or create a new offer letter."
        />
      </Card>
    </motion.div>
  );
};

export default OfferList;