export const MODULES = {
  admissions: {
    tab: 'Admissions',
    icon: 'fa-solid fa-user-plus',
    title: 'Admissions & Student Registration',
    desc: 'Streamline the entire applicant journey. From custom online application forms and entrance test scoring to automated merit lists and final enrollment documentation.',
    bullets: [
      'Customizable registration forms',
      'Automated B-Form & document verification',
      'Instant SMS notifications on admission status',
    ],
    preview: {
      header: 'Recent Inquiries',
      headerRight: 'View All',
      items: [
        { title: 'Hamza Khan (Class 8th)', sub: 'Applied Today via Online Portal', status: 'Pending Test', statusColor: 'amber' },
        { title: 'Ayesha Siddiqui (Class 5th)', sub: 'Applied 2 days ago', status: 'Approved', statusColor: 'emerald' },
      ],
    },
  },
  academics: {
    tab: 'Academics',
    icon: 'fa-solid fa-book-open-reader',
    title: 'Academics, Exams & Report Cards',
    desc: 'Easily manage term exams, grading criteria, subject allocations, and generate customized report cards with rank calculations instantly.',
    bullets: ['Term-wise exam scheduling', 'Custom grading & ranking rules', 'One-click report card generation'],
    preview: {
      header: 'Term Exam Status',
      headerRight: 'Mid-Term 2026',
      items: [
        { title: 'Class 9th - Mathematics', sub: 'Teacher: Sir Tariq', status: 'Grades Uploaded', statusColor: 'blue' },
        { title: 'Class 10th - Physics', sub: 'Teacher: Madam Nargis', status: 'Pending Verification', statusColor: 'amber' },
      ],
    },
  },
  finance: {
    tab: 'Finance & Fees',
    icon: 'fa-solid fa-file-invoice-dollar',
    title: 'Fee Management & Challans',
    desc: 'Generate thermal or A4 fee challans in bulk, track default payments, handle concessions, and integrate with online banking channels.',
    bullets: ['Bulk challan generation (A4 / thermal)', 'Online payment gateway integration', 'Defaulter tracking & reminders'],
    preview: {
      header: 'Monthly Fee Summary',
      headerRight: 'September 2026',
      items: [
        { title: 'Total Chalan Generated', sub: '2,456 Students', status: 'Rs. 12.5M', statusColor: 'emerald' },
        { title: 'Collected Today', sub: 'Bank & Online Gateway', status: 'Rs. 450,000', statusColor: 'blue' },
      ],
    },
  },
  transport: {
    tab: 'Transport',
    icon: 'fa-solid fa-bus',
    title: 'Transport & Fleet Management',
    desc: 'Monitor school bus routes, assign student pickups, manage driver logs, and give parents real-time tracking updates.',
    bullets: ['Live GPS route tracking', 'Driver & vehicle logs', 'Parent pickup/drop notifications'],
    preview: {
      header: 'Active Fleet Routes',
      headerRight: '12 Vans / Buses',
      items: [
        { title: 'Route #04 (Gulshan to Campus)', sub: 'Driver: Muhammad Aslam', status: 'On Route', statusColor: 'emerald' },
        { title: 'Route #09 (DHA Phase 6)', sub: 'Driver: Rashid Khan', status: 'Arrived', statusColor: 'emerald' },
      ],
    },
  },
};

export const MODULE_KEYS = Object.keys(MODULES);