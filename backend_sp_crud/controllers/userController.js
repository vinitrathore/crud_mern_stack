const db = require('../db/connection');

// Get all users



exports.getAllUsers = async (req, res) => {
  const search = req.query.search || '';
  const page = Math.max(1, parseInt(req.query.page)) || 1;
  const limit = Math.max(1, parseInt(req.query.limit)) || 10;
  const offset = (page - 1) * limit;

  // Validate and sanitize sorting inputs
  const allowedSortFields = ['name', 'email', 'created_at'];
  const allowedSortOrders = ['ASC', 'DESC'];

  const sortBy = allowedSortFields.includes(req.query.sort_by) ? req.query.sort_by : 'created_at';
  const sortOrder = allowedSortOrders.includes(req.query.sort_order?.toUpperCase())
    ? req.query.sort_order.toUpperCase()
    : 'DESC';

  try {
    const [rows] = await db.query("CALL GetUsersWithSearchPagination(?, ?, ?, ?, ?)", [
      search,
      limit,
      offset,
      sortBy,
      sortOrder
    ]);

    res.json({
      message: 'Users fetched successfully',
      page,
      limit,
      sortBy,
      sortOrder,
      data: rows[0] || []
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    // console.log("vijeta:",req.params.userId)
    const [rows] = await db.query('CALL checkUserById(?)', [req.params.userId]);
    if (rows[0].length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0][0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.createUser = async (req, res) => {
  const { name, email, phone, created_by } = req.body; // ← now getting from body

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, Email, Phone, and phone are required' });
  }

  try {
    // res.send({name,email,phone})
    let data = {
      name, email, phone, created_by
    }
    // console.log("data is",data);/
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    console.log("existing:", existing);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }


    const [rows] = await db.query("CALL CreateUser(?, ?, ?, ?)", [
      name,
      email,
      phone,
      created_by
    ]);

    const insertedUserId = rows[0]?.[0]?.id || null;

    res.status(201).json({
      message: 'User created successfully',
      userId: insertedUserId
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateUserById = async (req, res) => {
  const { name, email, phone } = req.body;
  const userId = req.params.userId;

  try {
    await db.query('CALL UpdateUserById(?, ?, ?, ?)', [
      userId,
      name,
      email,
      phone,
    ]);

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// exports.deleteUserById = async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     const [rows] = await db.query('CALL deleteUserById(?)', [userId]);

//     // Stored procedures return results as an array of arrays
//     const status = rows[0]?.status;

//     if (!status) {
//       return res.status(500).json({ error: 'Unexpected stored procedure result' });
//     }

//     if (status === 'User not found or already deleted') {
//       return res.status(404).json({ error: status });
//     }

//     res.json({ message: status });

//   } catch (err) {
//     console.error('Error deleting user:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };





exports.deleteUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await db.query('CALL deleteUserById(?)', [userId]);

    // Fix: rows[0] is the first result set (array), rows[0][0] is first row (object)
    const status = rows[0]?.[0]?.status;

    if (!status) {
      return res.status(500).json({ error: 'Unexpected stored procedure result' });
    }

    if (status === 'User not found or already deleted') {
      return res.status(404).json({ error: status });
    }

    res.json({ message: status });

  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
