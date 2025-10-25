const express = require('express');
const router = express.Router();
const {
    getAllOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    updateOrganizationStatus
} = require('../controllers/organizationController');

// Organization CRUD routes
router.get('/', getAllOrganizations);
router.get('/:id', getOrganization);
router.post('/', createOrganization);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

// Status update route
router.patch('/:id/status', updateOrganizationStatus);

module.exports = router;