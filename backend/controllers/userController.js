const db = require('../config/database');

/**
 * @desc    Get all users for an organization
 * @route   GET /api/users/organization/:orgId
 * @access  Public
 */
exports.getUsersByOrganization = async (req, res) => {
    try {
        const { orgId } = req.params;

        const [rows] = await db.query(
            `SELECT u.*, o.name as organization_name 
             FROM users u 
             JOIN organizations o ON u.organization_id = o.id 
             WHERE u.organization_id = ? 
             ORDER BY u.created_at DESC`,
            [orgId]
        );

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public
 */
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT u.*, o.name as organization_name 
             FROM users u 
             JOIN organizations o ON u.organization_id = o.id 
             ORDER BY u.created_at DESC`
        );

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT u.*, o.name as organization_name 
             FROM users u 
             JOIN organizations o ON u.organization_id = o.id 
             WHERE u.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        });
    }
};

/**
 * @desc    Create new user
 * @route   POST /api/users
 * @access  Public
 */
exports.createUser = async (req, res) => {
    try {
        const { organization_id, name, role, email, status } = req.body;

        // Validation
        if (!organization_id || !name || !role) {
            return res.status(400).json({
                success: false,
                error: 'Please provide organization_id, name, and role'
            });
        }

        // Validate role
        const validRoles = ['Admin', 'Co-ordinator'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid role. Must be Admin or Co-ordinator'
            });
        }

        // Check if organization exists
        const [orgCheck] = await db.query(
            'SELECT id FROM organizations WHERE id = ?',
            [organization_id]
        );

        if (orgCheck.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Organization not found'
            });
        }

        const [result] = await db.query(
            `INSERT INTO users (organization_id, name, role, email, status) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                organization_id,
                name,
                role,
                email || null,
                status || 'Active'
            ]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: result.insertId,
                organization_id,
                name,
                role
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create user'
        });
    }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Public
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove fields that shouldn't be updated
        delete updates.id;
        delete updates.created_at;
        delete updates.organization_id; // Don't allow changing organization

        // Check if user exists
        const [existing] = await db.query(
            'SELECT id FROM users WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Validate role if provided
        if (updates.role) {
            const validRoles = ['Admin', 'Co-ordinator'];
            if (!validRoles.includes(updates.role)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid role. Must be Admin or Co-ordinator'
                });
            }
        }

        // Build dynamic update query
        const updateFields = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');
        
        const updateValues = Object.values(updates);

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }

        await db.query(
            `UPDATE users SET ${updateFields} WHERE id = ?`,
            [...updateValues, id]
        );

        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user'
        });
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Public
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user'
        });
    }
};

/**
 * @desc    Update user status
 * @route   PATCH /api/users/:id/status
 * @access  Public
 */
exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Active', 'Co-ordinator', 'Inactive'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be Active, Co-ordinator, or Inactive'
            });
        }

        const [result] = await db.query(
            'UPDATE users SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User status updated successfully',
            data: { status }
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user status'
        });
    }
};