export const children = [
  {
    id: "sara",
    name: "Sara Ahmed",
    initials: "SA",
    className: "Class 7",
    section: "Section A",
    rollNo: "ST-0718",
    school: "Beaconhouse School",
    color: "#eaf4ff",
    ink: "#0872e4",
    attendance: 94,
    present: 23,
    absent: 1,
    late: 1,
    average: "A",
    feeDue: 12500,
    feeStatus: "Due soon",
    nextExam: "Mathematics",
    examDate: "18 Oct 2026",
    homework: 3,
  },
  {
    id: "hamza",
    name: "Hamza Ahmed",
    initials: "HA",
    className: "Class 4",
    section: "Section B",
    rollNo: "ST-0426",
    school: "Beaconhouse School",
    color: "#f2eaff",
    ink: "#7c3aed",
    attendance: 89,
    present: 21,
    absent: 2,
    late: 2,
    average: "A-",
    feeDue: 8500,
    feeStatus: "Overdue",
    nextExam: "Science",
    examDate: "20 Oct 2026",
    homework: 2,
  },
];

export const attendanceRecords = [
  { date: "09 Oct 2026", day: "Friday", subject: "Regular classes", status: "Present" },
  { date: "08 Oct 2026", day: "Thursday", subject: "Regular classes", status: "Present" },
  { date: "07 Oct 2026", day: "Wednesday", subject: "Regular classes", status: "Late" },
  { date: "06 Oct 2026", day: "Tuesday", subject: "Regular classes", status: "Present" },
  { date: "05 Oct 2026", day: "Monday", subject: "Regular classes", status: "Present" },
  { date: "02 Oct 2026", day: "Friday", subject: "Regular classes", status: "Absent" },
  { date: "01 Oct 2026", day: "Thursday", subject: "Regular classes", status: "Present" },
  { date: "30 Sep 2026", day: "Wednesday", subject: "Regular classes", status: "Present" },
  { date: "29 Sep 2026", day: "Tuesday", subject: "Regular classes", status: "Present" },
  { date: "28 Sep 2026", day: "Monday", subject: "Regular classes", status: "Late" },
];

export const feeRecords = [
  { id: "INV-2026-108", month: "October 2026", title: "Monthly Tuition Fee", amount: 12500, due: "15 Oct 2026", status: "Pending" },
  { id: "INV-2026-092", month: "September 2026", title: "Monthly Tuition Fee", amount: 12500, due: "15 Sep 2026", status: "Paid" },
  { id: "INV-2026-077", month: "August 2026", title: "Monthly Tuition Fee", amount: 12500, due: "15 Aug 2026", status: "Paid" },
  { id: "INV-2026-065", month: "July 2026", title: "Summer Activity Fee", amount: 2500, due: "10 Jul 2026", status: "Paid" },
  { id: "INV-2026-052", month: "June 2026", title: "Monthly Tuition Fee", amount: 12500, due: "15 Jun 2026", status: "Paid" },
];

export const events = [
  { day: "12", month: "OCT", title: "Parent–Teacher Meeting", detail: "10:00 AM · Main Hall", tint: "#eaf4ff", ink: "#0872e4" },
  { day: "18", month: "OCT", title: "Mathematics Assessment", detail: "Regular class hours", tint: "#f2eaff", ink: "#7c3aed" },
  { day: "24", month: "OCT", title: "Science Exhibition", detail: "9:00 AM · School Ground", tint: "#e7fbf2", ink: "#0a9b69" },
];

export const activities = [
  { title: "Sara's attendance was updated", time: "Today · 9:15 AM", icon: "calendar" },
  { title: "October fee invoice is available", time: "Yesterday · 2:40 PM", icon: "receipt" },
  { title: "New Mathematics homework posted", time: "Yesterday · 11:20 AM", icon: "book" },
];
