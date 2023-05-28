import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    files: {
      type: Array,
      default: [],
    } 
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Comments', CommentSchema);