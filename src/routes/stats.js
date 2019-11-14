const express = require('express');
const router = express.Router();

/**
 * Routes HTTP GET requests to the specified path with the specified callback functions.
 * See {@link https://expressjs.com/es/api.html#app.get.method} and {@link https://nodejs.org/api/modules.html#modules_module_exports}
 */
router.get('/stats', (req, res) => {
    // Renderiza la página de estadísticas
    res.render('contents/stats');
});

module.exports = router;