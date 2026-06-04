import InterviewRound from "../model/InterviewRound.js";
import CandidateStatus from "../model/CandidateStatus.js";
import InterviewType from "../model/InterviewType.js";
import InterviewStatus from "../model/InterviewStatus.js";

const seed = async (Model, items) => {
  for (const item of items) {
    const exists = await Model.findOne({ systemName: item.systemName });
    if (!exists) await Model.create(item);
  }
};

export const seedLookupValues = async () => {
  await seed(InterviewRound, [
    { systemName: 'first',  displayName: 'First Interview',  order: 1, color: 'blue',    isActive: true },
    { systemName: 'second', displayName: 'Second Interview', order: 2, color: 'purple',  isActive: true },
    { systemName: 'third',  displayName: 'Third Interview',  order: 3, color: 'volcano', isActive: true },
  ]);

  await seed(CandidateStatus, [
    { systemName: 'shortlisted', displayName: 'Shortlisted',      order: 1, color: 'default', isActive: true },
    { systemName: 'assessment',  displayName: 'Assessment',        order: 2, color: 'orange',  isActive: true },
    { systemName: 'first',       displayName: 'First Interview',  order: 3, color: 'blue',    isActive: true },
    { systemName: 'second',      displayName: 'Second Interview', order: 4, color: 'purple',  isActive: true },
    { systemName: 'third',       displayName: 'Third Interview',  order: 5, color: 'volcano', isActive: true },
    { systemName: 'offered',     displayName: 'Offered',          order: 6, color: 'gold',    isActive: true },
    { systemName: 'hired',       displayName: 'Hired',            order: 7, color: 'green',   isActive: true },
    { systemName: 'rejected',    displayName: 'Rejected',         order: 8, color: 'red',     isActive: true },
  ]);

  await seed(InterviewType, [
    { systemName: 'video',      displayName: 'Video Call', order: 1, isActive: true },
    { systemName: 'in-person',  displayName: 'In Person',  order: 2, isActive: true },
  ]);

  await seed(InterviewStatus, [
    { systemName: 'draft',      displayName: 'Draft',      order: 1, color: 'default', isActive: true },
    { systemName: 'scheduled',  displayName: 'Scheduled',  order: 2, color: 'blue',    isActive: true },
    { systemName: 'completed',  displayName: 'Completed',  order: 3, color: 'green',   isActive: true },
    { systemName: 'cancelled',  displayName: 'Cancelled',  order: 4, color: 'orange',  isActive: true },
    { systemName: 'failed',     displayName: 'Failed',     order: 5, color: 'red',     isActive: true },
  ]);

  console.log('✓ Lookup values seeded');
};
