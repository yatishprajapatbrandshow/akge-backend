const { Components } = require('../models')

// Create
exports.createComponent = async (req, res) => {
    try {
        const { componentName } = req.body;

        const existing = await Components.findOne({ componentName, deleteflag: false });
        if (existing) {
            return res.json({
                status: false,
                message: "Components with this name already exists",
                data: false
            });
        }

        const component = new Components(req.body);
        const saved = await component.save();

        res.json({
            status: true,
            message: "Components created",
            data: saved
        });
    } catch (err) {
        console.log(err);
        
        res.json({
            status: false,
            message: "Error creating component",
            data: false
        });
    }
};


// Read All
exports.getAllComponents = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;

        const query = {
            deleteflag: false,
            $or: [
                { componentName: { $regex: search, $options: 'i' } },
                { componentType: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [components, total] = await Promise.all([
            Components.find(query).skip(skip).limit(parseInt(limit)),
            Components.countDocuments(query)
        ]);

        res.json({
            status: true,
            message: "Data fetched",
            data: components,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        res.json({
            status: false,
            message: "Error fetching components",
            data: false
        });
    }
};

exports.getComponentsByCategory = async (req, res) => {
    try {
        // 1. Get category from the URL's route parameters
        const { categoryName } = req.params;

        // 2. Get pagination details from the query string
        const { page = 1, limit = 10 } = req.query;

        // 3. Construct the query to find documents
        const query = {
            deleteflag: false,
            status: "Active",
            category: categoryName // Directly filter by the category name
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // 4. Execute database queries concurrently for efficiency
        const [components, total] = await Promise.all([
            Components.find(query)
                .select('componentName')
                .skip(skip)
                .limit(parseInt(limit)),
            Components.countDocuments(query)
        ]);

        // 5. Send the structured JSON response
        res.json({
            status: true,
            message: `Data fetched for category: ${categoryName}`,
            data: components,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });

    } catch (err) {
        // 6. Handle potential server errors
        console.error("Error in getComponentsByCategory:", err); // Log the error for debugging
        res.status(500).json({
            status: false,
            message: "Error fetching components by category",
            data: false
        });
    }
};

// Read by ID
exports.getComponentById = async (req, res) => {
    try {
        const component = await Components.findOne({ _id: req.params.id, deleteflag: false });
        if (!component) return res.json({ status: false, message: "Components not found", data: false });
        res.json({ status: true, message: "Components found", data: component });
    } catch (err) {
        res.json({ status: false, message: "Error", data: false });
    }
};

// Update
exports.updateComponent = async (req, res) => {
    try {
        const updated = await Components.findByIdAndUpdate(req.params.id, {
            ...req.body,
            editedon: new Date()
        }, { new: true });

        if (!updated) return res.json({ status: false, message: "Components not found", data: false });
        res.json({ status: true, message: "Components updated", data: updated });
    } catch (err) {
        res.json({ status: false, message: "Update error", data: false });
    }
};

// Soft Delete
exports.deleteComponent = async (req, res) => {
    try {
        const deleted = await Components.findByIdAndUpdate(req.params.id, {
            deleteflag: true,
            editedon: new Date(),
            editedby: req.body.editedby || "system"
        }, { new: true });

        if (!deleted) return res.json({ status: false, message: "Components not found", data: false });
        res.json({ status: true, message: "Components soft deleted", data: deleted });
    } catch (err) {
        res.json({ status: false, message: "Delete error", data: false });
    }
};
