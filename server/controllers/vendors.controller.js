// import modules
const { 
    getAllVendors,
    getVendorById,
    getVendorByUserId,
    insertVendor,
    updateVendorById,
    deleteVendorById 
} = require('../services/vendors.service');
const { getUserById } = require('../services/users.service');

// controller module object
module.exports = {
    getAllVendors: (req, res) => {
        getAllVendors((error, results) => {
            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: 'Failed to retrieve vendors...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        })
    },
    getVendorById: (req, res) => {
        const id = req.params.id;

        getVendorById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve vendor data...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'vendor not found...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    getVendorByUserId: (req, res) => {
        // get id from params
        const id = req.params.id;

        getVendorByUserId(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0, 
                    message: 'Failed to get vendor...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'No vendor found'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    insertVendor: (req, res) => {
        // request body
        const body = req.body;
        const userId = body.user_id;

        if (!body.vendor_name || !body.contact_no || !body.address) {
            return res.status(500).json({
                success: 0,
                message: 'Vendor name, contact number and address are required...'
            });
        } 

        if (!userId) {
            return res.status(500).json({
                success: 0,
                message: 'User ID is required...'
            }); 
        } else {
            getUserById(userId, (error, results) => {
                if (error) {
                    return res.status(400).json({
                        success: 0,
                        message: 'Failed to retrieve user...'
                    });
                } else if (!results) {
                    return res.status(500).json({
                        success: 0,
                        message: 'No user found...'
                    });
                } else {
                    if (results.is_verified !== 1) {
                        return res.status(500).json({
                            success: 0,
                            message: 'Email verification is required to proceed...'
                        });
                    }

                    // insert new user
                    insertVendor(body, (error, results) => {
                        if (error) {
                            return res.status(400).json({
                                success: 0,
                                message: 'Failed to insert vendor...'
                            });
                        } else {
                            return res.status(200).json({
                                success: 1,
                                message: 'Vendor created successfully!'
                            });
                        }
                    });
                }
            });
        }
    },
    updateVendorById: (req, res) => {
        // get request body and image file
        const body = req.body;

        if (!body.vendor_id) {
            return res.status(500).json({
                success: 0,
                message: 'Vendor ID is required'
            });
        }

        if (req.file) {
            const imageUrl = req.file.filename;
            body.image_url = imageUrl;
        } 

        updateVendorById(body, body.vendor_id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to update vendor...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    deleteVendorById: (req, res) => {
        // get id from params
        const id = req.params.id;

        // check if user exists 
        getVendorById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve vendor...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'Vendor not found...'
                });
            } else {
                deleteVendorById(id, (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            success: 0,
                            message: 'Failed to delete vendor...'
                        });
                    } else {
                        return res.status(200).json({
                            success: 1,
                            message: 'Vendor deleted successfully!'
                        });
                    }
                });
            }
        });
    }
}