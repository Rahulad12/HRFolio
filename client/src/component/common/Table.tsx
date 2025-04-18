// components/common/AnimatedTable.tsx
import { ConfigProvider, Table } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
interface AnimatedTableProps {
    loading: boolean;
    data: any[];
    columns: any[];
    pageSize?: number;
    className?: string;
}

const CustomTable = ({
    loading,
    data,
    columns,
    pageSize = 2,
    className = ''
}: AnimatedTableProps) => {
    const { darkMode } = useTheme();
    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        colorText: darkMode ? "#C63C51" : "#191D32",
                        colorBgContainer: darkMode ? "#1c1c1e" : "#FBFBFF",
                        headerBg: darkMode ? "#141414" : "#f4f4f8",
                        headerColor: darkMode ? "#C63C51" : "#1F3B61",
                        fontSize: 13,
                        colorTextHeading: darkMode ? "#C63C51" : "#1F3B61",
                        colorTextBase: darkMode ? "#C63C51" : "#191D32",
                        padding: 12,
                        borderColor: darkMode ? "#141414" : "#e5e7eb",
                        paddingSM: 8,
                        footerBg: darkMode ? "#141414" : "#f4f4f8",
                        footerColor: darkMode ? "#C63C51" : "#1F3B61",
                    }
                }
            }}
        >
            <Table
                dataSource={data}
                rowKey="_id"
                columns={columns}
                loading={loading}
                size='middle'
                sortDirections={['ascend', 'descend', 'ascend']}
                pagination={{
                    total: data.length,
                    pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    showTotal: (total) => (
                        <motion.span
                            className="text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            Showing <b>{Math.min(pageSize, total)}</b> of <b>{total}</b> candidates
                        </motion.span>
                    ),
                }}
                scroll={{ x: 55 * 5 }}
                className={`antd-table-custom ${className}`}
                rowClassName="hover:bg-gray-50 transition-colors"
                components={{
                    body: {
                        row: ({ children, ...props }) => (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                {...props}
                            >
                                {children}
                            </motion.tr>
                        ),
                    },
                }}
            />
        </ConfigProvider>

    );
};

export default CustomTable;
