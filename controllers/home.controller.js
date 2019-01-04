// const { to, eRe, sRe } = require('../services/util.service');

function Dashboard(req, res) {
  // const user = req.user.id;
  return res.json({
    success: true,
    message: 'it worked',
    data: 'user name is :',
  });
}
module.exports.Dashboard = Dashboard;
