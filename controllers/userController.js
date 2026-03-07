const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');
// GET /
exports.home = async(req, res)=>{
  const users = await User.find().lean();
  res.render('index', {title: "Home", users} );
}
  // GET /add
  exports.addPage = (req, res)=>{
    res.render('add',{title: 'Add New User'});
  };

  // POST /add
  exports.addUser = async (req, res)=>{
    const user = new User({
      ...req.body,
      image: req.file.filename
    });
    await user.save();

    req.session.message = {type: 'success', message: "User added"};
    res.redirect('/');
  };

  // GET /edit/:id
  exports.editPage = async(req, res)=>{
    const user = await User.findById(req.params.id).lean();
    if(!user) return res.redirect('/');
    res.render('edit', {title: 'Edit User', user});
  };

  // POST /edit/:id
  exports.editUser = async(req, res)=>{
    let image = req.body.old_image;

    if(req.file){
      image = req.file.filename;
      await fs.unlink(path.join(__dirname, '../public/uploads', req.body.old_image));
    }

    await User.findByIdAndUpdate(req.params.id,{
      ...req.body,
      image
    });

    req.session.message = {type: 'success', message: 'Update'};
    res.redirect('/');
  };