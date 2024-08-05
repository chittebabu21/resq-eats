// import all modules
const {
    getAllAdmins,
    getAdminById,
    getAdminByUserId,
    insertAdmin,
    deleteAdminById
} = require('../services/admins.service');

// export the controller module
module.exports = {
    getAllAdmins: (req, res) => {
        getAllAdmins((error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve admins...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    getAdminById: (req, res) => {
        const id = req.params.id;

        getAdminById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve admin...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'Admin not found...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    getAdminByUserId: (req, res) => {
        const id = req.params.id;

        getAdminByUserId(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve admin...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'Admin not found...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    insertAdmin: (req, res) => {
        const body = req.body;

        if (!body.user_id) {
            return res.status(500).json({
                success: 0,
                message: 'User ID is required...'
            });
        }

        getUserById(body.user_id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve user...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'User does not exists...'
                });
            } else {
                const userId = results.user_id;

                if (userId === body.user_id) {
                    insertAdmin(body, (error, results) => {
                        if (error) {
                            return res.status(400).json({
                                success: 0,
                                message: 'Failed to insert admin...'
                            });
                        } else {
                            return res.status(200).json({
                                success: 1,
                                message: 'Admin inserted successfully into database!'
                            });
                        }
                    });
                } else {
                    return res.status(500).json({
                        success: 0,
                        message: 'Body and user ID do not match...'
                    });
                }
            }
        });
    },
    deleteAdminById: (req, res) => {
        const id = req.params.id;

        if (!id) {
            return res.status(500).json({
                success: 0,
                message: 'Admin ID is required...'
            });
        }

        deleteAdminById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to delete admin...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    message: 'Admin deleted successfully!'
                });
            }
        });
    }
}