// import modules
const {
    getAllMenuItems,
    getMenuItemById,
    getMenuItemByVendorId,
    insertMenuItem,
    updateMenuItem,
    deleteMenuItemById
} = require('../services/menu.service');

// export controller module 
module.exports = {
    getAllMenuItems: (req, res) => {
        getAllMenuItems((error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve all menu items...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    getMenuItemById: (req, res) => {
        const id = req.params.id;

        getMenuItemById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve menu item...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0, 
                    message: 'Menu item not found...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    getMenuItemByVendorId: (req, res) => {
        const id = req.params.id;

        getMenuItemByVendorId(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to get menu item...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'No menu item with vendor ID found...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    insertMenuItem: (req, res) => {
        const body = req.body;

        if (!body.food_name || !body.quantity || !body.vendor_id) {
            return res.status(500).json({
                success: 0,
                message: 'Food name, quantity and vendor ID are required...'
            });
        } 

        insertMenuItem(body, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to insert new menu item...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    message: 'Menu item created successfully!'
                });
            }
        });
    },
    updateMenuItem: (req, res) => {
        const body = req.body;

        if (!body.food_id) {
            return res.status(500).json({
                success: 0,
                message: 'Food ID is required...'
            });
        }

        if (req.file) {
            const imageUrl = req.file.filename;
            body.image_url = imageUrl;
        } 

        updateMenuItem(body, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to update menu item...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    deleteMenuItemById: (req, res) => {
        const id = req.params.id;

        getMenuItemById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve menu item...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'Menu item not found...'
                });
            } else {
                deleteMenuItemById(id, (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            success: 0,
                            message: 'Failed to delete menu item...'
                        });
                    } else {
                        return res.status(200).json({
                            success: 1,
                            message: 'Menu item deleted successfully!'
                        });
                    }
                });
            }
        });
    }
}