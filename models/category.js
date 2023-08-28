const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const CategorySchema = new Schema (
    {
        title:{
            type:String,
            required:true,
            unique:true,
        },

       
       category:{
        type:Schema.Types.ObjectId,
        ref:"User",
       },
    },
    {timestamps: true}
);

CategorySchema.plugin(uniqueValidator);
module.exports = model("Category", CategorySchema);