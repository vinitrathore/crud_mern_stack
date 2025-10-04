// const User = require('../models/User'); // Adjust path as needed
const User = require('../models/User');

// Create a user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }  // return the updated document
    );
    // await User.deleteMany({});

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Base filter: only non-deleted users
    let searchQuery = { isDelete: false };

    // If search term exists, extend the query
    if (search.trim() !== '') {
      searchQuery = {
        $and: [
          { isDelete: false },
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { phone: { $regex: search, $options: 'i' } }
            ]
          }
        ]
      };
    }

    const skip = (pageNumber - 1) * limitNumber;

    const users = await User.find(searchQuery)
      .sort({ createdAt: -1 }) // Sort newest first
      .skip(skip)
      .limit(limitNumber);

    const totalUsers = await User.countDocuments(searchQuery);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
      totalUsers,
      users
    });

  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: err.message });
  }
};

