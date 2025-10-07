const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

// http://localhost:4000/api/users?search=rah&page=1&limit=10&sort_by=created_at&sort_order=ASC
router.get('/users', userController.getAllUsers);
// http://localhost:4000/api/users/1
router.get('/users/:userId', userController.getUserById);
// http://localhost:4000/api/users
// {
//     "name":"vijayraj",
//     "email":"raj234234e@gmail.com",
//     "phone":"7896786873"
//   }
router.post('/users', userController.createUser);
router.put('/users/:userId', userController.updateUserById);

router.delete('/users/:userId',userController.deleteUserById)

module.exports = router;
