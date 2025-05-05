import LineChart from "../Charts/LineGraph";
import { useAppSelector } from "../../Hooks/hook";
import { Card } from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const HiredandRejectedCorelation = () => {
    const { candidate } = useAppSelector((state) => state.candidate);

    const startOfThisWeek = dayjs().startOf("isoWeek"); // Monday
    const endOfThisWeek = dayjs().endOf("isoWeek");     // Sunday

    const labels = Array.from({ length: 7 }).map((_, i) =>
        startOfThisWeek.add(i, "day").format("ddd")
    );

    const hiredData = Array(7).fill(0);
    const rejectedData = Array(7).fill(0);

    candidate.forEach((c) => {
        // Hired
        if (c.progress?.hired?.completed && c.status === "hired") {
            const hiredDate = dayjs(c.progress.hired.date);
            if (hiredDate.isBetween(startOfThisWeek, endOfThisWeek, null, "[]")) {
                const dayIndex = hiredDate.isoWeekday() - 1; // Monday = 0
                hiredData[dayIndex]++;
            }
        }

        // Rejected
        if (c.status === "rejected" && c.updatedAt) {
            const rejectedDate = dayjs(c.updatedAt);
            if (rejectedDate.isBetween(startOfThisWeek, endOfThisWeek, null, "[]")) {
                const dayIndex = rejectedDate.isoWeekday() - 1;
                rejectedData[dayIndex]++;
            }
        }
    });

    return (
        <Card
            title="Hired and Rejected Correlation (Last 7 days)"
        >
            <div className="flex justify-between items-center">
                <LineChart
                    labels={labels}
                    hiredData={hiredData}
                    rejectedData={rejectedData}
                    size={500}
                />
            </div>
        </Card>
    );
};

export default HiredandRejectedCorelation;
