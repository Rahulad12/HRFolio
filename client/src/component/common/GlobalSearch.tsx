import { Drawer, Input, List, Skeleton, Empty } from 'antd';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSearchTermsQuery } from '../../services/searchService';
import { useDebounce } from '../../Hooks/useDebounce';

const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);
    const navigate = useNavigate();


    const { data: results, isFetching } = useGetSearchTermsQuery(debouncedQuery, {
        skip: !debouncedQuery.trim(),
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSelectResult = (item: any) => {
        onClose();
        navigate(`/dashboard/candidates/${item._id}`);
    };

    return (
        <Drawer
            title="Global Search"
            placement="right"
            onClose={onClose}
            open={isOpen}
            width={400}
        >
            <Input
                placeholder="Search candidates, technologies, levels..."
                prefix={<Search size={18} className='text-gray-400' />}
                value={query}
                onChange={handleChange}
                autoFocus
                allowClear
            />

            <div className="mt-4">
                {isFetching ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                ) : results && results.data.length > 0 ? (
                    <List
                        dataSource={results?.data}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleSelectResult(item)}
                                className="cursor-pointer p-2 rounded"
                            >
                                <div>
                                    <div className="font-semibold capitalize">{item.name}</div>
                                    <div className="text-xs text-gray-500 capitalize">{item.technology} - {item.level}</div>
                                </div>
                            </List.Item>
                        )}
                    />
                ) : query.trim() ? (
                    <Empty
                        description="No Results Found"
                        className="mt-10"
                    />
                ) : null}
            </div>
        </Drawer>
    );
};

export default GlobalSearch;
