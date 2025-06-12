import Profile from "../models/Profile.js";
import mongoose from "mongoose";


const Update=async(req,res)=>
{
     const { userId, name, bio, skills, socialLinks } = req.body;
     let socialLink;
       if (typeof socialLinks === 'string') {
    try {
      console.log(typeof socialLinks);
      socialLink = JSON.parse(socialLinks);
       console.log(typeof socialLink);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid socialLinks JSON' });
    }
  }

  try {
    let profile = await Profile.findOne({ userId });

      
    const imagePath = req.file ? req.file.filename : null;


    if (profile) {
      // Update existing profile
      profile.name = name;
      profile.bio = bio;
      profile.skills = skills;
      profile.socialLinks = socialLink;
      if(req.file)
        {profile.image=imagePath
;}
      await profile.save();
      return res.json(profile);
    }
  
    // Create new profile
    profile = new Profile({ userId, name, bio, skills, socialLink});
    if(req.file.filename)
    {
      profile.image = imagePath;
    }

  
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

const Delete =async(req,res)=>
{
 try {
    const profile = await Profile.findOneAndDelete({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const getProfile = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ msg: 'Invalid user ID format' });
  }

  try {
     console.log(userId);
     const id=new mongoose.Types.ObjectId(userId);
    const profile = await Profile.findOne({userId:id});
    console.log(profile);
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error',err:err });
  }
};
export{Update,Delete,getProfile};