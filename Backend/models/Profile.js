import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  bio: { type: String },
  skills: [{ type: String }],
  image: { type: String },
  socialLinks: {
    twitter: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String }
  }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
