const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const StorySchema = new Schema (
    {
        title:{
            type:String,
            required:true,
            
        },

        imageUrl:{
            type:String,
            required:true,
            
        },



        slug:{
            type:String,
            required:true,
            unique:true,
            
        },


        body:{
            type:String,
            required:true,
            
        },

        viewsCount:{
            type: Number,
            default: 0,
        },

       
       category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
       },


       comment:[{
        type:Schema.Types.ObjectId,
        ref:"Comment",
       }],

       createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
       },
    },
    {timestamps: true}
);

StorySchema.plugin(uniqueValidator);
module.exports = model("Story", StorySchema);