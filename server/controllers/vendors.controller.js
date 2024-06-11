// import modules
const { 
    getAllVendors,
    getVendorById,
    insertVendor,
    updateVendorById,
    deleteVendorById 
} = require('../services/vendors.service');

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
    insertVendor: (req, res) => {
        // request body
        const body = req.body;

        if (!body.vendor_name || !body.contact_no || !body.address) {
            return res.status(500).json({
                success: 0,
                message: 'Vendor name, contact number and address are required...'
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