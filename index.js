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

const ADMIN = process.env.ADMIN;
const PASSWORD = process.env.PASSWORD;
const MLAB_ADDRESS = process.env.MLAB_ADDRESS;

mongoose.connect('mongodb://'+ ADMIN + ':' + PASSWORD + '@//' + MLAB_ADDRESS);
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
        return 'Shopify Backend Challenge Winter 2019 - AAMIR AHMAD (aamirahmad@outlook.com)';
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
        description: 'Create a new shop by ID.',
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
      path: '/api/v1/product/shop/{shopId}',
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
      path: '/api/v1/product/{pId}',
      config: {
        description: 'Get specific product by Product ID.',
        tags: ['api', 'v1', 'products']
      },
      handler: (req, h) => {
        return Product.findById(req.params.pid); 
      }
    },
    {
      method: 'GET',
      path: '/api/v1/orders/{shopId}',
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
    {
      method: 'POST',
      path: '/api/v1/{shopId}/order/add',
      config: {
        description: 'Add order to shop by Shop ID.',
        tags: ['api', 'v1', 'orders', 'shop', 'add']
      },
      handler: (req, h) => { 
        const lineIds = new Array;
        const total = lineIds.sum();
        // parse and get lineIds from req.payload
        // put them in order obj
        const order = new Order({
          line: lineIds,
          total,
        });
        return Shop.findByIdAndUpdate(req.params.shopId, {$push: {orders: order}})
      }
    },
    {
      method: 'GET',
      path: '/api/v1/order/{orderId}',
      config: {
        description: 'Get order by Order ID.',
        tags: ['api', 'v1', 'orders']
      },
      handler: (req, h) => {
        return Order.findById(req.params.orderId) 
      }
    },
    {
      method: 'GET',
      path: '/api/v1/line/{lineId}',
      config: {
        description: 'Get line by Line ID.',
        tags: ['api', 'v1', 'line']
      },
      handler: (req, h) => {
        return Line.findById(req.params.lineId) 
      }
    },
    {
      method: 'POST',
      path: '/api/v1/line',
      config: {
        description: 'Create a new line',
        tags: ['api', 'v1', 'painting']
      },
      handler: (req, res) => {
        const {name, pid, quantity, price} = req.payload;
        const line = new Shop({
          name,
          pid,
          quantity,
          price,
        });
        return line.save();
      }
    },
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();