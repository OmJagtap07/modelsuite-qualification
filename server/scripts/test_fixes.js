const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { createTask, updateTask } = require('../controllers/taskController');
const { reviewSubmission } = require('../controllers/submissionController');

async function runTests() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test_pipeline');
  console.log('Connected to MongoDB.');

  // Clean db
  await User.deleteMany({});
  await Task.deleteMany({});
  await Submission.deleteMany({});

  // Create users
  const admin = await User.create({ name: 'Admin', email: 'admin@test.com', password: 'pwd', role: 'Admin' });
  const talent = await User.create({ name: 'Talent', email: 'talent@test.com', password: 'pwd', role: 'Talent' });

  // Mock req, res
  const mockRes = () => {
    const res = {};
    res.status = function (code) { this.statusCode = code; return this; };
    res.json = function (data) { this.data = data; return this; };
    return res;
  };

  console.log('\n--- Testing Issue #2: Task Assignment ---');
  
  // 1. Create task assigned to Admin (should fail)
  let req = { body: { title: 'T1', assignedTo: admin._id }, user: admin };
  let res = mockRes();
  await createTask(req, res);
  console.log('Create assigned to Admin -> Status:', res.statusCode, '| Msg:', res.data?.message);

  // 2. Create task assigned to Talent (should succeed)
  req = { body: { title: 'T2', assignedTo: talent._id }, user: admin };
  res = mockRes();
  await createTask(req, res);
  console.log('Create assigned to Talent -> Status:', res.statusCode || 201, '| Task ID:', res.data?._id);
  const taskId = res.data._id;

  // 3. Update task assigned to Admin (should fail)
  req = { params: { id: taskId }, body: { assignedTo: admin._id } };
  res = mockRes();
  await updateTask(req, res);
  console.log('Update assigned to Admin -> Status:', res.statusCode, '| Msg:', res.data?.message);

  // 4. Update task assigned to Talent (should succeed)
  req = { params: { id: taskId }, body: { assignedTo: talent._id } };
  res = mockRes();
  await updateTask(req, res);
  console.log('Update assigned to Talent -> Status:', res.statusCode || 200, '| Task:', res.data?.title);

  // 5. Create unassigned task (should succeed)
  req = { body: { title: 'T3' }, user: admin };
  res = mockRes();
  await createTask(req, res);
  console.log('Create unassigned -> Status:', res.statusCode || 201, '| Task ID:', res.data?._id);

  console.log('\n--- Testing Issue #8: Cascading Approval ---');

  // Create submission
  const sub = await Submission.create({ taskId, talentId: talent._id, fileUrl: 'test', notes: 'test' });
  
  // Set task to submitted
  await Task.findByIdAndUpdate(taskId, { status: 'Submitted' });

  // Review submission - Approved
  req = { params: { id: sub._id }, body: { reviewStatus: 'Approved' } };
  res = mockRes();
  await reviewSubmission(req, res);
  console.log('Review Approved -> Status:', res.statusCode || 200, '| Sub Status:', res.data?.reviewStatus);

  // Verify task status
  const taskAfter = await Task.findById(taskId);
  console.log('Parent Task Status in DB:', taskAfter.status);

  mongoose.connection.close();
}

runTests().catch(console.error);
