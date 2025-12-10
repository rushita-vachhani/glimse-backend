const mongoose = require('mongoose');

const commentarySchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [1, 'Comment cannot be empty'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sport: {
    type: String,
    enum: ['cricket', 'football', 'basketball', 'general'],
    default: 'general'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

commentarySchema.index({ createdAt: -1 });
commentarySchema.index({ userId: 1 });
commentarySchema.index({ sport: 1 });

module.exports = mongoose.model('Commentary', commentarySchema);
