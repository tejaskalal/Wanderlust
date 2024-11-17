const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title:{ type : String,
            required : true,
    },
    description:String,
    image:{type : String ,
        default : "https://unsplash.com/photos/view-of-wooden-cabin-near-a-forest-AcLA1EsDT0s",
           set : (v) =>v==="" ? "https://unsplash.com/photos/view-of-wooden-cabin-near-a-forest-AcLA1EsDT0s"
            : v,
    },
    price:Number,
    location:String ,
    country:String,
    reviews :[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ]
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;