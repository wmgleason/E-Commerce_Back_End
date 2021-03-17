const router = require('express').Router();
const apiRoutes = require('./api');
//THIS TELLS THE WHOLE APP THAT THE ROUTES WILL BE FOUND IN /api folder so it isn't shown explicitly elsewhere
router.use('/api', apiRoutes);

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;