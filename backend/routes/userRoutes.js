const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUser,
    getUsersByOrganization,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus
} = require('../controllers/userController');

// User CRUD routes
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.get('/organization/:orgId', getUsersByOrganization);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Status update route
router.patch('/:id/status', updateUserStatus);

module.exports = router;