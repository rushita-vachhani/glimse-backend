import Sport from '../models/Sport.js';

// @desc    Get all sports
// @route   GET /api/sports
// @access  Public
export const getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find({}).sort({ name: 1 });
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a sport
// @route   POST /api/sports
// @access  Admin
export const createSport = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const sport = new Sport({ name });
    const createdSport = await sport.save();
    res.status(201).json(createdSport);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sport', error: error.message });
  }
};

// @desc    Delete a sport
// @route   DELETE /api/sports/:id
// @access  Admin
export const deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (sport) {
      await sport.deleteOne();
      res.json({ message: 'Sport removed' });
    } else {
      res.status(404).json({ message: 'Sport not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getLiveCricketScores = async (req, res) => {
  // Placeholder logic
  res.status(200).json({ message: "Live cricket scores" });
};

export const getTodayFootballScores = async (req, res) => {
  // Placeholder logic
  res.status(200).json({ message: "Today's football scores" });
};