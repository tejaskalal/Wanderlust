const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


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
        },
    ],
});


listingSchema.post("findOneAndDelete" , async (listiing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in:Listing.reviews}});
    }

});


const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;