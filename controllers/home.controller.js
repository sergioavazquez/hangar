const { to, eRe, sRe } = require('../services/util.service');

const Dashboard = function(req, res){
	let user = req.user.id;
	return res.json({success:true, message:'it worked', data:'user name is :'});
}
module.exports.Dashboard = Dashboard