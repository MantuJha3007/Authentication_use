import app from "./src/app.js"; // isme dot js lagana hai 
import connectDB from "./src/config/database.js";

connectDB();
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})