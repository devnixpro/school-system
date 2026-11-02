require('dotenv').config();

const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const app = require('../src/app');

const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

function getIsolatedMongoUri() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required to run the parent portal E2E test.');
  }

  const uri = new URL(process.env.MONGO_URI);

  if (
    !['mongodb:', 'mongodb+srv:'].includes(uri.protocol) ||
    !localHosts.has(uri.hostname)
  ) {
    throw new Error(
      'Parent portal E2E tests are restricted to a local MongoDB instance.'
    );
  }

  const databaseName = `parent_portal_e2e_${process.pid}_${Date.now()}`;
  uri.pathname = `/${databaseName}`;

  return { uri: uri.toString(), databaseName };
}

async function main() {
  const { uri, databaseName } = getIsolatedMongoUri();
  const testSecret = `parent-e2e-${require('node:crypto').randomBytes(32).toString('hex')}`;
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = testSecret;

  let server;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

    const School = require('../src/models/School.model');
    const User = require('../src/models/User');
    const Student = require('../src/models/Student');
    const Attendance = require('../src/models/Attendance');
    const Fee = require('../src/models/Fee.model');
    const Exam = require('../src/models/Exam.model');
    const Homework = require('../src/models/Homework.model');
    const Timetable = require('../src/models/Timetable.model');
    const Notice = require('../src/models/Notice.model');

    const school = await School.create({
      name: 'Parent Portal E2E School',
      email: 'school@parent-e2e.test'
    });
    const parent = await User.create({
      name: 'E2E Parent',
      email: 'parent@parent-e2e.test',
      password: 'local-e2e-password',
      role: 'parent',
      school: school._id
    });
    const otherParent = await User.create({
      name: 'Other Parent',
      email: 'other@parent-e2e.test',
      password: 'local-e2e-password',
      role: 'parent',
      school: school._id
    });
    const student = await Student.create({
      name: 'E2E Student',
      email: 'student@parent-e2e.test',
      rollNumber: 'E2E-001',
      class: 'Grade 5',
      section: 'A',
      guardianEmail: parent.email,
      parentUsers: [parent._id],
      school: school._id
    });
    const otherStudent = await Student.create({
      name: 'Private Student',
      email: 'private@parent-e2e.test',
      rollNumber: 'E2E-002',
      class: 'Grade 9',
      section: 'B',
      guardianEmail: otherParent.email,
      parentUsers: [otherParent._id],
      school: school._id
    });

    const now = new Date();
    const today = new Date(now);
    today.setUTCHours(9, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const month = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}`;

    await Attendance.create([
      { school: school._id, student: student._id, date: today, status: 'present' },
      { school: school._id, student: student._id, date: yesterday, status: 'absent' }
    ]);
    await Fee.create({
      school: school._id,
      studentId: student._id,
      invoiceNo: 'E2E-INV-001',
      month: 'E2E Test',
      amount: 1000,
      paidAmount: 250,
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: 'partial'
    });
    await Exam.create({
      school: school._id,
      subject: 'Mathematics',
      examType: 'Midterm',
      className: 'Grade 5',
      date: today,
      startTime: '09:00',
      duration: 60,
      totalMarks: 100,
      results: [{ student: student._id, obtainedMarks: 87, grade: 'A' }]
    });
    await Homework.create({
      school: school._id,
      title: 'E2E Homework',
      description: 'Parent dashboard test record',
      classId: 'Grade 5',
      subject: 'Science',
      dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      assignedBy: parent._id,
      submissions: [
        { student: student._id, status: 'submitted' },
        { student: otherStudent._id, status: 'submitted' }
      ]
    });
    await Timetable.create([
      {
        school: school._id,
        className: 'Grade 5',
        section: 'A',
        day: 'Monday',
        subject: 'Mathematics',
        teacher: 'E2E Teacher',
        startTime: '09:00',
        endTime: '10:00'
      },
      {
        school: school._id,
        className: 'Grade 9',
        section: 'B',
        day: 'Monday',
        subject: 'Private Subject',
        teacher: 'Other Teacher',
        startTime: '10:00',
        endTime: '11:00'
      }
    ]);
    await Notice.create([
      {
        school: school._id,
        title: 'Parent Notice',
        content: 'Visible to parents',
        targetAudience: 'Parents'
      },
      {
        school: school._id,
        title: 'General Notice',
        content: 'Visible to everyone',
        targetAudience: 'All'
      },
      {
        school: school._id,
        title: 'Teacher Notice',
        content: 'Not visible to parents',
        targetAudience: 'Teachers'
      }
    ]);

    server = app.listen(0, '127.0.0.1');
    await new Promise((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });

    const baseUrl = `http://127.0.0.1:${server.address().port}/api`;
    const request = async (path, options = {}) => {
      const response = await fetch(`${baseUrl}${path}`, options);
      const body = await response.json();
      return { status: response.status, body };
    };
    const expectSuccess = (result, label) => {
      assert.equal(result.status, 200, `${label} should return HTTP 200`);
      assert.equal(result.body.success, true, `${label} should succeed`);
      return result.body.data;
    };

    const badLogin = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: parent.email, password: 'incorrect-password' })
    });
    assert.equal(badLogin.status, 401, 'invalid credentials should be rejected');

    const login = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: parent.email, password: 'local-e2e-password' })
    });
    assert.equal(login.status, 200, 'parent login should succeed');
    assert.equal(login.body.data.role, 'parent', 'login should identify the parent role');

    const token = login.body.token;
    const headers = { Authorization: `Bearer ${token}` };
    const profile = expectSuccess(await request('/auth/me', { headers }), 'profile');
    assert.equal(profile.email, parent.email, 'profile should match the logged-in parent');

    const unauthenticated = await request('/parent/children');
    assert.equal(unauthenticated.status, 401, 'parent data should require authentication');

    const children = expectSuccess(
      await request('/parent/children', { headers }),
      'linked children'
    );
    assert.equal(children.length, 1, 'parent should see only their linked child');
    assert.equal(String(children[0]._id), String(student._id), 'linked child should match');
    assert.equal(children[0].className, student.class, 'child class should be normalized');

    const childPath = `/parent/children/${student._id}`;
    const summary = expectSuccess(
      await request(`${childPath}/summary`, { headers }),
      'child summary'
    );
    assert.equal(summary.attendancePercentage, 50, 'summary attendance should be accurate');
    assert.equal(summary.feeDue, 750, 'summary outstanding fee should be accurate');
    assert.equal(summary.homework, 1, 'summary homework count should be accurate');

    const attendance = expectSuccess(
      await request(`${childPath}/attendance?month=${month}`, { headers }),
      'monthly attendance'
    );
    assert.equal(attendance.records.length, 2, 'attendance should include both test records');
    assert.equal(attendance.summary.present, 1, 'attendance present count should be accurate');

    const invalidMonth = await request(`${childPath}/attendance?month=not-a-month`, { headers });
    assert.equal(invalidMonth.status, 400, 'invalid attendance month should be rejected');

    const fees = expectSuccess(await request(`${childPath}/fees`, { headers }), 'fees');
    assert.equal(fees.totals.total, 1000, 'fee total should be accurate');
    assert.equal(fees.totals.paid, 250, 'paid fee total should be accurate');
    assert.equal(fees.totals.due, 750, 'fee balance should be accurate');

    const results = expectSuccess(
      await request(`${childPath}/results`, { headers }),
      'exam results'
    );
    assert.equal(results.length, 1, 'published result should be returned');
    assert.equal(results[0].subjects[0].marksObtained, 87, 'student marks should be returned');

    const homework = expectSuccess(
      await request(`${childPath}/homework`, { headers }),
      'homework'
    );
    assert.equal(homework.length, 1, 'class homework should be returned');
    assert.equal(homework[0].submissions.length, 1, 'homework must expose only this child submission');
    assert.equal(
      String(homework[0].submissions[0].student),
      String(student._id),
      'homework submission should belong to the linked child'
    );

    const timetable = expectSuccess(
      await request('/timetable', { headers }),
      'timetable'
    );
    assert.equal(timetable.length, 1, 'timetable should only include linked child classes');
    assert.equal(timetable[0].className, student.class, 'timetable should match child class');

    const notices = expectSuccess(
      await request('/notices?targetAudience=Parents', { headers }),
      'parent notices'
    );
    assert.deepEqual(
      new Set(notices.map((notice) => notice.targetAudience)),
      new Set(['Parents', 'All']),
      'parents should receive parent and general notices only'
    );

    const otherChild = await request(`/parent/children/${otherStudent._id}/summary`, { headers });
    assert.equal(otherChild.status, 404, 'parent must not access another parent child');

    console.log('Parent portal E2E passed: login, profile, child privacy, summary, attendance, fees, results, homework, timetable, and notices.');
    console.log(`Temporary database ${databaseName} was used; no existing database was modified.`);
  } finally {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }

    if (mongoose.connection.readyState) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }

    if (previousSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = previousSecret;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
