const express = require("express")
const path = require('path') //To get the views path in ejs.
const cookieParser = require('cookie-parser')

const URL = require('./models/url')
const { connectMongoDB } = require('./connect')

const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const {checkForAuthentication, restrictTo} = require('./middlewares/auth')

const app = express()
const PORT = 8001
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthentication)

connectMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log('Mongo connected'))

//Using EJS
app.set("view engine", "ejs") 
app.set("views", path.resolve("./10Short-URL/views"))

app.use("/url", restrictTo(["NORMAL"]), urlRoute)
app.use("/user", userRoute)
app.use("/", staticRoute)

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() }}, },
        { new: true }
);
    console.log(entry)
    res.redirect(entry.redirectURL)
});


app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));