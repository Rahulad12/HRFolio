import { Skeleton } from 'antd'
const CandidateProfileLoading = () => {
    return (
        <div className="space-y-6">
            <Skeleton active paragraph={{ rows: 1 }} title />
            <Skeleton.Input style={{ width: 150 }} active />
            <Skeleton paragraph={{ rows: 4 }} active />
            <Skeleton active title={false} paragraph={{ rows: 6 }} />
            <Skeleton active title={false} paragraph={{ rows: 3 }} />
        </div>
    )
}

export default CandidateProfileLoading
