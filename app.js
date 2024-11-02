const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const{ listingSchema } = require("./schema.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/info";

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


app.get("/" , (req , res)=>{
    res.send("Hi , I'am root");
});

//Index route
app.get("/listings" , wrapAsync(async (req , res)=>{
     const allListings = await Listing.find({});
     res.render("listings/index.ejs" , {allListings});
} ));


//New route
app.get("/listings/new" ,(req , res)=>{
    res.render("listings/new.ejs");
} );


//Show route
app.get("/listings/:id" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
}));


//Create Route
app.post("/listings" , wrapAsync(async (req ,  res , next)=>{
   let result =  listingSchema.validate(req.body);
   console.log(result);
   if(result.error){

   }throw new ExpressError(400 , result.error);
    // let listing = req.body.listing;
    const newListing = new Listing(req.body.listing);
    await  newListing.save();
    //   console.log(listing);
    res.redirect("/listings");
    
    
}));


//Edit Route
app.get("/listings/:id/edit" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));



//Update Route
app.put("/listings/:id" , wrapAsync(async(req , res)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "send valid data for listing");
    }
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listings/${id}`);
}));


//Delete Route
app.delete("/listings/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// app.get("/testListing" ,async (req , res)=>{
//      let sampleListing = new Listing ({
//         title :"My New Villa",
//         description :"By the Beach",
//         price : 1200,
//         location :"Calangute, Goa",
//         country :"India",
//      });

//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("successful");
// });


app.all("*" , (req , res , next)=>{
    next( new ExpressError(404 , "Page Not Found!"));
})

app.use((err , req , res , next)=>{
    let {statusCode=500 , message="somoething went wrong!"} = err;
    res.render("error.ejs" , {message});
    // res.status(statusCode).send(message);
})


app.listen(8080 , ()=>{
    console.log("server is listening to port 8080");
});