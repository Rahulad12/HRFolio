import { Table, Pagination } from 'antd';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface AnimatedTableProps {
    loading: boolean;
    data: any[];
    columns: any[];
    pageSize?: number;
    className?: string;
    rowSelection?: any;
}

const AnimatedRow = ({ children, ...props }: any) => (
    <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        {...props}
    >
        {children}
    </motion.tr>
);

const CustomTable: React.FC<AnimatedTableProps> = ({
    loading,
    data,
    columns,
    pageSize: defaultPageSize = 2,
    rowSelection,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const currentData = data.slice(startIdx, endIdx);

    return (
        <Table
            dataSource={currentData}
            columns={columns}
            rowKey="_id"
            loading={loading}
            size="large"
            sortDirections={['ascend', 'descend', 'ascend']}
            scroll={{ x: 'max-content' }}
            pagination={false}
            rowSelection={rowSelection}
            footer={() => (
                <div className="gap-2 flex justify-center items-baseline flex-wrap">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Showing <b>{currentData.length}</b> of <b>{data.length}</b> results
                    </motion.span>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={data.length}
                        showSizeChanger
                        pageSizeOptions={['2', '5', '10', '20', '50']}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                    />
                </div>
            )}
            components={{
                body: {
                    row: AnimatedRow,
                },
            }}
        />
    );
};

export default CustomTable;
