import mongoose, { Schema, Types } from "mongoose";


export interface Imessage extends mongoose.Document {
    role : string;
    content : string;
}

export interface Iwebsite extends mongoose.Document {
    userId : Types.ObjectId;
    title : string;
    deployed : boolean;
    deployedUrl : string;
    slug : string;
    latestCode : string;
    conversation : Imessage[];
}

const messageSchema : Schema<Imessage> = new Schema<Imessage>({
    role : {
        type : String,
        enum : ["ai", 'user'],
        required : true
    },
    content : {
        type : String,
        required  : true
    }
}, {timestamps : true});

const websiteSchema : Schema<Iwebsite> = new Schema<Iwebsite> ({
    userId : {
       type : mongoose.Schema.Types.ObjectId,
       required : true, 
    },
    title : {
        type : String,
        default : "Untitled Website",
    },
    latestCode: {
        type: String,
        required: true,
    },
    conversation : {
        type : [messageSchema],
        required : true,
    },
    deployed : {
        type : Boolean,
        default : false,
    },
    deployedUrl : {
        type : String,
    },
    slug : {
        type : String,
        unique : true,
        sparse : true,
    }
}, {timestamps : true});

const Websites = mongoose.models.Websites || mongoose.model("Websites", websiteSchema);
export default Websites;