const hapi = require('hapi');
const mongoose = require('mongoose');

/* swagger section */
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

// Models
const Line = require('./models/Line');
const Product = require('./models/Product');
const Shop = require('./models/Shop');
const Order = require('./models/Order');

const admin = process.env.ADMIN;
const password = process.env.PASSWORD;

mongoose.connect('mongodb://'+ admin + ':' + password + '@ds111496.mlab.com:11496/shopify-winter-19-backend-challenge-db');
mongoose.connection.once('open', () => {
    console.log('connected to db');
});

const server = hapi.server({
    port: 4000,
    host: 'localhost'
})

const init = async () => {
    
    await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'Shopify W19 Challenge API Documentation',
					version: Pack.version
				}
			}
		}
	]);
    
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (req, res) => {
                return 'Hello World!';
            }
        },
        {
            method: 'GET',
            path: '/api/v1/shops',
			config: {
				description: 'Get all the shops',
				tags: ['api', 'v1', 'shops']
			},
            handler: (req, res) => {
                return Shop.find();
            }
        }, 
        {
            method: 'POST',
            path: '/api/v1/shops',
            config: {
				description: 'Get a specific painting by ID.',
				tags: ['api', 'v1', 'painting']
			},
            handler: (req, res) => {
                const {name} = req.payload;
                const shop = new Shop({
                    name,
                });
                return shop.save();
            }
        },
        {
            method: 'GET',
            path: '/api/v1/{shopId}/products',
            config: {
				description: 'Get all products by Shop ID.',
				tags: ['api', 'v1', 'products', 'shop']
			},
            handler: (req, h) => {
                Shop.findById(req.params.shopId)
                .populate('products')
                .exec((err, shop) => {
                  return h.response(shop.products);
                })    
            }
        },
        {
            method: 'GET',
            path: '/api/v1/{shopId}/orders',
            config: {
				description: 'Get all orders by Shop ID.',
				tags: ['api', 'v1', 'orders', 'shop']
			},
            handler: (req, h) => {
                Shop.findById(req.params.shopId)
                .populate('orders')
                .exec((err, shop) => {
                  return h.response(shop.orders);
                })    
            }
        },
        // {
        //     method: 'POST',
        //     path: '/api/v1/{shopId}/orders/add',
        //     config: {
		// 		description: 'Add order to shop by Shop ID.',
		// 		tags: ['api', 'v1', 'orders', 'shop', 'add']
		// 	},
        //     handler: (req, h) => { 
        //         const lineIds = new Array;
        //         // parse and get lineIds from req.payload
        //         // put them in order obj
        //         const order = new Order({
        //             line: lineIds,
        //         });
        //         const 
        //         return Shop.findByIdAndUpdate(req.params.shopId, {$push: {orders: order}})
        //     }
        // }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();