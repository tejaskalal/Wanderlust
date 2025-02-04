const express =require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{ listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req , res , next)=>{
    let {error}=  listingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400 , errMsg);
   }else{
    next();
   }
}

//Index route
router.get("/" , wrapAsync(async (req , res)=>{
     const allListings = await Listing.find({});
     res.render("listings/index.ejs" , {allListings});
} ));


//New route
router.get("/new" ,(req , res)=>{
    res.render("listings/new.ejs");
} );


// //Show route
// app.get("/listings/:id" , wrapAsync(async(req , res)=>{
//     let {id} = req.params;
//     const listing =  await Listing.findById(id);
//     res.render("listings/show.ejs" , {listing});
// }));



//Show route
router.get("/:id" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate({
    path:"reviews"});

    if(!listing){
        req.flash("error" , "Cannot find that listing!");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs" , {listing});
}));


//Create Route
router.post("/" , validateListing , wrapAsync(async (req ,  res , next)=>{
    const newListing = new Listing(req.body.listing);
    await  newListing.save();
    req.flash("success" , "Successfully made a new listing!");
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}));



//Update Route
router.put("/:id" ,validateListing, wrapAsync(async(req , res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id , {...req.body.listing});
   req.flash("success" , "Successfully updated a listing!");
   res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Successfully deleted a listing!");
    res.redirect(`/listings${id}`);
}));


module.exports = router;