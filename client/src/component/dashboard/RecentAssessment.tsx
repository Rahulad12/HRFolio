import { Badge, Card, Table } from "antd"
import CustomTable from "../common/Table"
const RecentAssessment = () => {
    const columns = [{
        title: 'Candidate',
        dataIndex: 'candidate',
        key: 'name',
        render: (record: any) => {
            return <span>{record?.name}</span>
        }
    },
    {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        render: (text: string) => {
            return <span>{text} / 100</span>
        }
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text: string) => {
            if (text === "Passed") {
                return <Badge status="success" text="Passed" />
            }
            else {
                return <Badge status="error" text="Failed" />
            }
        }
    }, {
        title: "Assessment Date",
        dataIndex: "assessment",
        key: "date",
        render: (text: string, record: any) => {
            return <span>{record?.assessment?.date}</span>
        }
    }
    ]

    const data = [{
        key: '1',
        candidate: {
            name: "John Doe"
        },
        score: 100,
        status: "Passed",
        assessment: {
            date: "2025-10-13"
        }
    },
    {
        key: '2',
        candidate: {
            name: "Jane Doe"
        },
        score: 20,
        status: "Failed",
        assessment: {
            date: "2025-10-13"
        }
    }
    ]
    return (
        <Card title="Recent Assessment">
            <Table
                columns={columns}
                dataSource={data}
                loading={false}
                rowKey="Key"
                size="small"
                pagination={false}
            />
        </Card>
    )
}

export default RecentAssessment
