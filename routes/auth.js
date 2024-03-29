const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER

router.post("/api/routes/auth/register", async (req, res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : hashedPass,
    });
    const user = await newUser.save();
    res.status(200).json(user);
}
catch(err){
    console.log(err);
    res.status(500).json(err);
}
})

//LOGIN
router.post("/api/routes/auth/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if(!user){
  res.status(400).json("Wrong credentials!");
  return;
  }
      
  
      const validated = await bcrypt.compare(req.body.password, user.password);
      !validated && res.status(400).json("Wrong password!") ;
  
      const { password, ...others } = user._doc;

      if(user && validated)
      res.status(200).json(others);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
module.exports = router;