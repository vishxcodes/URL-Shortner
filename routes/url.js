const experess = require("express")
const router = experess.Router()

const {handleGenerateShortUrl, handleGetAnalytics} = require("../controllers/url")

router.post('/', handleGenerateShortUrl)
router.get('/analytics/:shortId',handleGetAnalytics)

module.exports = router;