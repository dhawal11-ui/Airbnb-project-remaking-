// client side validations karliye (form meh data bharte waqt ke by moongose schema).
// dikkat kya aii ki hoppostoch and aur kisi se post ya create request bheje toh woh direct app.js se hokar mongoDb (datavbase) meh save hojayegi but hame usper bhi validations (conditions) lagana hai .. Agr ham  directly create and post route meh aisa likhe toh bhi chalga
//
// if(!parseListing.description){
//    throw new ExpressError(400, "description is missing");
// }
// but baat whi hai kitne routes meh yeh copy paste karege and kitne ke liye likhege ya edit karege. isliye hum ek new schema banarhe hai as joi schema taki woh server side validations ka dhyan rakh sake. iska mongoose wale listingSchema ka koi use nhi hai . jo listing client side se ayi by hoppostoshc or dircetly website usko db me save kartne se pehele chekc kr e. therefore, usse requrie v nhi ki8ya .

const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0), // minimum value
    image: Joi.string().allow("", null),
  }).required(), // jo listing ayi client side se usko recheck kre ki lisitng he hai n
});

module.exports = listingSchema;
