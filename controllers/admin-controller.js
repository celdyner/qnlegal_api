const User = require("../models/user");
const paginate = require("express-paginate");



const updateOne = async(req,res) => {
    try{
         await User.findByIdAndUpdate(req.param.id, req.body);
         return res.status(201).json({
            message:"Item successfully updated",
            success:true,
         });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};



const getAll = async(req,res) => {
    try{
        const [results, itemCount] = await 
        Promise.all([
            User.find({})
                .sort({createdAt: -1})
                .limit(req.query.limit)
                .skip(req.skip)
                .lean()
                .exec(),
                User.count({}),

        ]);
        const pageCount = Math.ceiling(itemCount / 
        req.query.limit);
        return res.status(201).json({
            object: "list",
            has_more: paginate.hasNextPages(req)
            (pageCount),
            data:results,
            pageCount,
            itemCount,
            currentPage: req.query.page,
            pages:paginate.getArrayPages(req)(3,
            pageCount, req.query.page),
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
}



const getOne = async(req,res) => {
    try{
        const item = await User.findById(req.param.id);
        if(item){
            return res.status(200).json(item);
        }
        return res.status(404).json({
            message: "Item not found",
            success: false
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports = {
   updateOne,
    getAll,
    getOne
}