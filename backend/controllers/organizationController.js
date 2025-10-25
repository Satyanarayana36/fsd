const db = require('../config/database');

/**
 * @desc    Get all organizations
 * @route   GET /api/organizations
 * @access  Public
 */
exports.getAllOrganizations = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM organizations ORDER BY created_at DESC'
        );
        
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch organizations'
        });
    }
};

/**
 * @desc    Get single organization by ID
 * @route   GET /api/organizations/:id
 * @access  Public
 */
exports.getOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.query(
            'SELECT * FROM organizations WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Organization not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching organization:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch organization'
        });
    }
};

/**
 * @desc    Create new organization
 * @route   POST /api/organizations
 * @access  Public
 */
exports.createOrganization = async (req, res) => {
    try {
        const {
            name,
            slug,
            email,
            contact,
            phone,
            alternative_phone,
            timezone,
            region,
            language,
            website_url,
            max_coordinators,
            logo_url
        } = req.body;

        // Validation
        if (!name || !slug || !email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name, slug, and email'
            });
        }

        // Generate unique organization ID
        const organization_id = `${slug.toUpperCase()}-${Date.now()}`;

        const [result] = await db.query(
            `INSERT INTO organizations 
            (name, slug, email, organization_id, contact, phone, alternative_phone, 
             timezone, region, language, website_url, max_coordinators, logo_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                slug,
                email,
                organization_id,
                contact || null,
                phone || null,
                alternative_phone || null,
                timezone || 'Asia/Colombo',
                region || null,
                language || 'English',
                website_url || null,
                max_coordinators || 5,
                logo_url || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Organization created successfully',
            data: {
                id: result.insertId,
                name,
                slug,
                email,
                organization_id
            }
        });
    } catch (error) {
        console.error('Error creating organization:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                error: 'Organization with this slug or email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to create organization'
        });
    }
};

/**
 * @desc    Update organization
 * @route   PUT /api/organizations/:id
 * @access  Public
 */
exports.updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove fields that shouldn't be updated
        delete updates.id;
        delete updates.created_at;
        delete updates.organization_id;

        // Check if organization exists
        const [existing] = await db.query(
            'SELECT id FROM organizations WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Organization not found'
            });
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
            `UPDATE organizations SET ${updateFields} WHERE id = ?`,
            [...updateValues, id]
        );

        res.status(200).json({
            success: true,
            message: 'Organization updated successfully'
        });
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update organization'
        });
    }
};

/**
 * @desc    Delete organization
 * @route   DELETE /api/organizations/:id
 * @access  Public
 */
exports.deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM organizations WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Organization not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Organization deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting organization:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete organization'
        });
    }
};

/**
 * @desc    Update organization status
 * @route   PATCH /api/organizations/:id/status
 * @access  Public
 */
exports.updateOrganizationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Active', 'Blocked', 'Inactive'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be Active, Blocked, or Inactive'
            });
        }

        const [result] = await db.query(
            'UPDATE organizations SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Organization not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Organization status updated successfully',
            data: { status }
        });
    } catch (error) {
        console.error('Error updating organization status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update organization status'
        });
    }
};