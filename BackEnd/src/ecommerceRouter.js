const express = require('express');
const ecommerceControlle = require('./ecommerceControlle');


const router = express.Router();

router.use(express.json());


router.get('/todosproducts', ecommerceControlle.listaproducts);
router.get('/todospacks', ecommerceControlle.listapacks);


module.exports = router;