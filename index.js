const sqlite3 = require('sqlite3');
const express = require("express");
let router = express.Router();
let app = express();
let bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080 ;

app.use('/api', bodyParser.json(), router);   //[use json]
app.use('/api', bodyParser.urlencoded({ extended: false }), router); 

const db = new sqlite3.Database('./data/shop_database.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    } 
    console.log('Connect database')
});

router.route('/stores')
    //get store
    .get((req, res) => {
        let data = {} ;
        db.all("SELECT * FROM stores", [], (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            data.datas = rows
            data.message = 'OK!'
            data.path = '/api/stores'
            data.method ='GET'
            res.status(200).send(data)
        });
    })
    // add store
    .post((req, res) => {
        let data = {} ; 
        db.run('INSERT INTO stores ( store_name, store_location, store_status) VALUES (?,?,?)',
        [ req.body.store_name, req.body.store_location, req.body.store_status],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            data.message = 'OK!'
            data.path = '/api/stores'
            data.method ='POST'

            res.status(201).send(data)
               
        });
    })
    // edit store
    .patch((req, res) => {
        let data = {} ; 
        db.run(`UPDATE stores set store_name = ?, store_location = ?, store_status = ? WHERE store_id = ?`,
        [req.body.store_name, req.body.store_location, req.body.store_status, req.body.store_id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            data.message = 'OK!'
            data.path = `/api/stores/${req.body.store_id}`
            data.method ='PATCH'
            res.status(200).send(data)
        });
    })
router.route('/stores/:store_id')    
    //สร้าง API ดึงข้อมูลของร้านค้าที่ประกอบไปด้วยสินค้าภายในร้าน (เฉพาะร้าน)
    .get((req, res) => {
        let data = {} ;
        db.all("SELECT product_id, product_name, product_status, product_stock FROM products INNER JOIN stores ON stores.store_id = products.store_id WHERE stores.store_id LIKE ?", [req.params.store_id], (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            data.datas = rows ;
            data.message = 'OK!'
            data.path = '/api/products'
            data.method ='GET'
            res.status(200).send(data)
        });
    })
    // delete store
    .delete((req, res) => {
        let data = {} ; 
        db.run(`DELETE FROM stores WHERE store_id = ?`,
        req.params.store_id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            data.message = 'OK!'
            data.path = `/api/stores/${store_id}`
            data.method ='DELETE'
            res.status(200).send(data)
            
        });
        
    })

router.route('/products')
    //สร้าง API ดึงข้อมูลของร้านค้าที่ประกอบไปด้วยสินค้าภายในร้าน
    .get((req, res) => {
        let data = {} ;
        db.all("SELECT store_name, product_name, product_status, product_stock FROM products INNER JOIN stores ON stores.store_id = products.store_id", [], (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            data.datas = rows 
            data.message = 'OK!'
            data.path = '/api/products'
            data.method ='GET'
            res.status(200).send(data)
        });
    })
    // add product
    .post((req, res) => {
        let data = {} ; 
        db.run('INSERT INTO products ( product_name, product_stock, store_id, product_status) VALUES (?,?,?,?)',
        [ req.body.product_name, req.body.product_stock, req.body.store_id, req.body.product_status],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            data.message = 'OK!'
            data.path = '/api/products'
            data.method ='POST'

            res.status(201).send(data)
               
        });

    })
    // edit product
    .patch((req, res) => {
        let data = {} ; 
        db.run(`UPDATE products set store_id = ?, product_name = ?, product_stock = ?, store_status = ? WHERE product_id = ?`,
        [req.body.store_id, req.body.product_name, req.body.product_stock, req.body.store_status, req.body.product_id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            data.message = 'OK!'
            data.path = `/api/stores/${req.body.product_id}`
            data.method ='PATCH'
            res.status(200).send(data)
        });
    })

router.route('/products/:product_id')    
    // delete product
    .delete((req, res) => {
        let data = {} ; 
        db.run(`DELETE FROM products WHERE product_id = ?`,
        req.params.product_id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            data.message = 'OK!'
            data.path = `/api/stores/${product_id}`
            data.method ='DELETE'
            res.status(200).send(data)
            
        });
        
    })




app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});