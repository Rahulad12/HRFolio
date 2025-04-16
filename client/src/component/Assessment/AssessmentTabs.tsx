import { Tabs, Card } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AssessmentsList from './AssessmentsList';
import AssignedAssessments from './AssignedAssessments';

const { TabPane } = Tabs;

const AssessmentTabs = () => {
    const [activeTab, setActiveTab] = useState("1");
    return (
        <div>
            <AnimatePresence mode="wait">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Assessment List" key="1">
                        <Card className="flex flex-col gap-4">
                            <AssessmentsList />
                        </Card>
                    </TabPane>
                    <TabPane tab="Assigned Assessments" key="2">
                        <Card className="flex flex-col gap-4">
                            <AssignedAssessments />
                        </Card>
                    </TabPane>
                </Tabs>
            </AnimatePresence>
        </div>
    );
};

export default AssessmentTabs;
