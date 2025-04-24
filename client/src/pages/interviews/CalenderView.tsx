import { Badge, Calendar } from 'antd'
import dayjs from 'dayjs'
import { useAppSelector } from '../../Hooks/hook'
const CalenderView = () => {
    const { interviews } = useAppSelector(state => state.interview);
    const dateCellRender = (value: dayjs.Dayjs) => {

        const listData = interviews.filter(interview => {
            const interviewDate = dayjs(interview.date);
            return (
                interviewDate.date() === value.date() &&
                interviewDate.month() === value.month() &&
                interviewDate.year() === value.year()
            );
        });

        return (
            <ul className="events p-0 m-0 max-h-12 overflow-hidden">
                {listData.map((interview) => (
                    <li key={interview._id} className="mb-1">
                        <Badge
                            status={
                                interview.status === 'scheduled' ? 'processing' :
                                    interview.status === 'completed' ? 'success' :
                                        interview.status === 'cancelled' ? 'error' : 'default'
                            }
                            text={
                                <span className="text-xs truncate block w-full">
                                    {dayjs(interview.date).format('HH:mm')} - {interview?.candidate?.name}
                                </span>
                            }
                        />
                    </li>
                ))}
            </ul>
        );
    };
    return (
        <div>
            <Calendar
                cellRender={dateCellRender}
                className="interview-calendar"
            />
        </div>
    )
}

export default CalenderView
