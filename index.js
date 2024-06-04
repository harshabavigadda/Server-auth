import express from "express";
import mongoose from "mongoose";
//const sql = require('mysql')
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { router as userRoute } from "./routes/user.route.js";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://user-auth-u8mm.onrender.com"]
  })
);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error:', err));


/*const db = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    insecureAuth : true,
    database: "data"
})

app.post('/signup',(req,res)=>{
    const val = [
        req.body.name,
        req.body.email,
        req.body.password,
    ]

    const mailq = "SELECT * FROM users WHERE email = ?";
    const mail = req.body.email;

    db.query(mailq, [mail], (err,ress)=>{
        if(err){
            console.log(err);
        return res.json(err);}
        
        if(ress.length > 0){
            return res.json("User found");
        }
        else{
            const insertq = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
            db.query(insertq,val, (err,result)=>{
                if(err){
                    console.log(err);
                return res.json(err);}
                else{
                console.log("INSERTED into DB");
                return res.json("sucess");}
            })
        }
    })
})

app.post('/signin', (req,res)=>{
    const val = [
        req.body.email,
        req.body.password
    ]

    const qu = "SELECT * FROM users WHERE email = ?";
    const m = req.body.email;

    db.query(qu,[m], (err,ress)=>{
        if(err){
            console.log(err);
            return res.json(err);
        }
        if(ress.length == 1){
            const que = "SELECT password FROM users WHERE email = ?"
            db.query(que,m, (err,result)=>{
                if(err){
                    console.log(err);
                    return res.json(err);
                }
                else{
                    if(ress.data != req.password){
                        return res.json("Pass wrong")
                    }
                    else{
                        return res.json("Success")
                    }
                }
            })
        }
        else{
            return res.json("No user found please signup")
        }
    })
})*/

// app.post('/signup', (req, res)=>{

//     const {name, email, password} = req.body;
//     models.findOne({email: email})
//     .then(user => {
//         if(user){
//             res.json("Already registered")
//         }
//         else{
//             models.create(req.body)
//             .then(log => res.json(log))
//             .catch(err => res.json(err))
//         }
//     })
// })

// app.post('/signin', (req, res)=>{

//     const {email, password} = req.body;
//     models.findOne({email: email})
//     .then(user => {
//         if(user){
//             if(user.password === password) {
//                 res.json("Success");
//             }
//             else{
//                 res.json("Pass wrong");
//             }
//         }
//         else{
//             res.json("No user found");
//         }
//     })
// })

app.use("/api", userRoute);

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`server started ${port}`);
});
