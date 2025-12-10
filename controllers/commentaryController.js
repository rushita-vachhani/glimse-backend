const Commentary = require('../models/Commentary');

// @desc    Get all commentaries
// @route   GET /api/commentaries
// @access  Private
exports.getAllCommentaries = async (req, res) => {
  try {
    // Fetch all commentaries, sorted by newest first
    const commentaries = await Commentary.find()
      .sort({ createdAt: -1 })
      .limit(100); // Limit to last 100 commentaries

    res.status(200).json(commentaries);
  } catch (error) {
    console.error('Error fetching commentaries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching commentaries',
      error: error.message
    });
  }
};

// @desc    Create new commentary
// @route   POST /api/commentaries
// @access  Private
exports.createCommentary = async (req, res) => {
  try {
    const { comment } = req.body;

    // Validate input
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    // Get user from auth middleware (req.user)
    const userId = req.user?.userId || req.user?._id;
    const username = req.user?.username || req.user?.name || 'Anonymous';

    // Create new commentary
    const newCommentary = await Commentary.create({
      comment: comment.trim(),
      username: username,
      userId: userId,
      sport: req.body.sport || 'general'
    });

    res.status(201).json({
      success: true,
      message: 'Commentary posted successfully',
      data: newCommentary
    });
  } catch (error) {
    console.error('Error creating commentary:', error);
    res.status(500).json({
      success: false,
      message: 'Error posting commentary',
      error: error.message
    });
  }
};

// @desc    Get commentaries by sport
// @route   GET /api/commentaries/sport/:sport
// @access  Private
exports.getCommentariesBySport = async (req, res) => {
  try {
    const { sport } = req.params;

    const commentaries = await Commentary.find({ sport })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: commentaries.length,
      data: commentaries
    });
  } catch (error) {
    console.error('Error fetching commentaries by sport:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching commentaries',
      error: error.message
    });
  }
};

// @desc    Delete commentary
// @route   DELETE /api/commentaries/:id
// @access  Private (own commentary only)
exports.deleteCommentary = async (req, res) => {
  try {
    const commentary = await Commentary.findById(req.params.id);

    if (!commentary) {
      return res.status(404).json({
        success: false,
        message: 'Commentary not found'
      });
    }

    // Check if user owns this commentary
    const userId = req.user?.userId || req.user?._id;
    if (commentary.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this commentary'
      });
    }

    await commentary.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Commentary deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting commentary:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting commentary',
      error: error.message
    });
  }
};