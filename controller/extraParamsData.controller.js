const { ExtraParamsData } = require('../models')

exports.createParam = async (req, res) => {
    try {
        const data = req.body;

        // Check if holder already exists for the same pageid
        const exists = await ExtraParamsData.findOne({ pageid: data.pageid, holder: data.holder, deleteflag: false });
        if (exists) {
            return res.json({ status: false, message: "Holder already exists for this pageid", data: false });
        }

        const param = new ExtraParamsData(data);
        await param.save();

        res.json({ status: true, message: "ExtraParamsData created", data: param });
    } catch (error) {
        res.json({ status: false, message: error.message, data: false });
    }
};

exports.getAllParams = async (req, res) => {
    try {
        const params = await ExtraParamsData.find({ deleteflag: false });
        res.json({ status: true, message: "Params fetched", data: params });
    } catch (error) {
        res.json({ status: false, message: error.message, data: false });
    }
};

exports.getParamById = async (req, res) => {
    try {
        const param = await ExtraParamsData.findById(req.params.id);
        if (!param || param.deleteflag) {
            return res.json({ status: false, message: "ExtraParamsData not found", data: false });
        }
        res.json({ status: true, message: "ExtraParamsData found", data: param });
    } catch (error) {
        res.json({ status: false, message: error.message, data: false });
    }
};

exports.updateParam = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const existing = await ExtraParamsData.findOne({
            _id: { $ne: id },
            pageid: data.pageid,
            holder: data.holder,
            deleteflag: false
        });

        if (existing) {
            return res.json({ status: false, message: "Same holder already exists for this pageid", data: false });
        }

        data.editedon = new Date();

        const updated = await ExtraParamsData.findByIdAndUpdate(id, data, { new: true });

        res.json({ status: true, message: "ExtraParamsData updated", data: updated });
    } catch (error) {
        res.json({ status: false, message: error.message, data: false });
    }
};

exports.deleteParam = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await ExtraParamsData.findByIdAndUpdate(id, { deleteflag: true }, { new: true });

        res.json({ status: true, message: "ExtraParamsData deleted", data: deleted });
    } catch (error) {
        res.json({ status: false, message: error.message, data: false });
    }
};

// controllers/param.controller.js

exports.getUsedHoldersByPageId = async (req, res) => {
    try {
        const pageid = req.params.pageid;
        console.log(pageid);
        const usedHolders = await ExtraParamsData.find(
            { pageid: pageid, deleteflag: false },
            { holder: 1, _id: 0 }
        );
        console.log(usedHolders);
        
        const holderList = usedHolders.map(item => item.holder);

        res.json({
            status: true,
            message: "Used holders fetched successfully",
            data: holderList.length > 0 ? holderList : false
        });

    } catch (error) {
        res.json({
            status: false,
            message: error.message,
            data: false
        });
    }
};
