import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import pg from "pg";
import env from "dotenv";

import session from "express-session";
import redis from "redis";
import RedisStore from "connect-redis";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";


const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;
env.config();
const __dirname = dirname(fileURLToPath(import.meta.url));


const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
    client: redisClient,
    prefix: "incarnageappclone:",
});


redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'dist')));

app.use(
    session({
        store: redisStore,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60, // 1 hour
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware to set CORS headers
/*app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Adjust the origin as needed
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});*/

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

const products = [
    {
        title: 'Varsity Supersize Tee',
        price: '3,850.00',
        gender: 'Male',
        category: 'Tshirt',
        path: '/images/product.webp',
        pathHover: '/images/hoverProductT.webp',
        stock: 0,
        size: [{ 'XS': 1 }, { 'S': 5 }, { 'L': 7 }, { 'XL': 20 }, { 'XXL': 2 }],
    },

    {
        title: 'Refined Hi-Rise Legging - Ink Navy',
        price: '6,500.00',
        gender: 'Female',
        category: 'bottom',
        path: '/images/LeggingBottom.webp',
        pathHover: '/images/hoverLeggings.webp',
        stock: 10,
        size: [{ 'M': 14 }, { 'L': 6 }, { 'XL': 9 }, { 'XXL': 20 }],
    },

    {
        title: 'Varsity Supersize Tee',
        price: '3,850.00',
        gender: 'Male',
        category: 'Tshirt',
        path: '/images/product.webp',
        pathHover: '/images/hoverProductT.webp',
        stock: 0,
        size: [{ 'XS': 4 }, { 'S': 5 }, { 'L': 12 }],
    },

    {
        title: 'Varsity Supersize Tee',
        price: '3,850.00',
        gender: 'Male',
        category: 'Tshirt',
        path: '/images/product.webp',
        pathHover: '/images/hoverProductT.webp',
        stock: 10,
        size: [{ 'XS': 19 }, { 'S': 8 }, { 'XL': 6 }, { 'XXL': 30 }],
    },

    {
        title: 'Varsity Supersize Tee',
        price: '3,850.00',
        gender: 'Male',
        category: 'Tshirt',
        path: '/images/product.webp',
        pathHover: '/images/hoverProductT.webp',
        stock: 10,
        size: [{ 'XS': 15 }, { 'S': 13 }, { 'L': 20 }],
    },

    {
        title: 'Varsity Supersize Tee',
        price: '3,850.00',
        gender: 'Male',
        category: 'Tshirt',
        path: '/images/product.webp',
        pathHover: '/images/hoverProductT.webp',
        stock: 10,
        size: [{ 'XS': 6 }, { 'S': 13 }, { 'L': 19 }, { 'XL': 17 }, { 'XXL': 21 }],
    },
];



async function checkTableExist(tableName) {
    const response = await db.query("select exists (select 1 from information_schema.tables where table_name = $1)", [tableName]);
    return response.rows[0].exists;
}

async function createTable() {
    try {
        await db.query('create table all_products (id serial primary key not null, title text not null, price text not null, gender varchar(10), category text not null, path text not null, "pathHover" text not null, stock int not null, size JSONB not null);');
        console.log("table created");
    } catch (e) {
        console.log(`error creating table : ${e}`);
    }
}

async function insertRecords() {
    try {
        for (let x = 0; x < products.length; x++) {
            await db.query(`insert into all_products (title, price, gender, category, path, "pathHover", stock, size) values ($1, $2, $3, $4, $5, $6, $7, $8)`, [products[x].title, products[x].price, products[x].gender, products[x].category, products[x].path, products[x].pathHover, products[x].stock, JSON.stringify(products[x].size)]);
        }
        console.log("Successfully inserted records into table");
    } catch (e) {
        console.log(`error inserting data into table all_products : ${e}`);
    }
}


async function readRecords() {
    try {
        const response = await db.query("select * from all_products;");
        let records = response.rows;
        console.log(records);
        return records;
    } catch (e) {
        console.log(`error reading records from table : ${e}`);
    }
}


const tableExists = await checkTableExist("all_products");
if (!tableExists) {
    console.log("table does not exist, table creating in progess....");
    await createTable();
    await insertRecords();
}

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

function checkRole(role) {
    return (req, res, next) => {
        // Assume have a 'role' field in your 'users' table
        if (req.user.role !== role) {
            return res
                .status(403)
                .json({ message: "You don't have permission to access this resource" });
        }
    }
}

async function checkResult(username) {
    const response = await db.query("select exists (select 1 from users where username = $1);", [username]);

    return response.rows[0].exists;

}


app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    try {
        if (username !== null && username !== undefined && password !== null && password !== undefined) {

            const recordExists = await checkResult(username);

            if (!recordExists) {
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`username: ${username}, password: ${password}`);
                        const result = await db.query("insert into users (username, password, role) values ($1, $2, $3) returning *", [username, hash, 'user']);
                        console.log(result);
                        res.status(200).json({ message: "User registered successfully" });
                    }
                });
            } else {
                res.status(409).json({ message: "User already exists" });
            }

        }
    } catch (e) {
        console.log(e);
    }

});


app.post("/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json({ message: "Logged in successfully", user: req.user });
});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) console.log(err);
        req.session.destroy((err) => {
            if (err) console.log(err);
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
});


app.get('/products', isAuthenticated, async (req, res) => {
    // Check if the product data is cached in Redis
    const cachedProducts = await redisClient.get('all_products');
    if (cachedProducts) {
        console.log('Serving products from cache');
        return res.json(JSON.parse(cachedProducts));
    }

    let allProducts = await readRecords();

    // Store the product data in the Redis cache
    await redisClient.set('all_products', JSON.stringify(allProducts), 'EX', 60 * 5); // Cache for 5 minutes

    res.json(allProducts);
});

app.get('/products/:id', isAuthenticated, async (req, res) => {
    const productID = parseInt(req.params.id);

    // Check if the product data is cached in Redis
    const cachedProduct = await redisClient.get(`product_${productID}`);
    if (cachedProduct) {
        console.log('Serving product from cache');
        return res.json(JSON.parse(cachedProduct));
    }

    let response = await db.query("select * from all_products where id = $1;", [productID]);
    let product = response.rows;

    if (response.rows.length > 0) {
        // Store the product data in the Redis cache
        await redisClient.set(`product_${productID}`, JSON.stringify(product), 'EX', 60 * 5); // Cache for 5 minutes
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.get('/authenticated', isAuthenticated, (req, res) => {
    res.json({ message: 'authenticated', user: req.user });
});


app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// local strategy

passport.use(
    "local",
    new Strategy(async (username, password, done) => {
        try {
            console.log(username);
            console.log(password);


            // Query the database to find the user
            const response = await db.query("SELECT * FROM users WHERE username = $1", [
                username,
            ]);

            console.log('Response rows:', response.rows);

            if (response.rows.length === 0) {
                console.log('User not found');
                return done(null, false, { message: "Incorrect username or password" });
            }

            const user = response.rows[0];
            console.log('User found:', user);

            // Compare the provided password with the hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.log('Error in bcrypt.compare:', err);
                    return done(err);
                }
                if (!isMatch) {
                    console.log('Password does not match');
                    return done(null, false, { message: "Incorrect username or password" });
                }
                console.log('Authentication successful');
                return done(null, user);
            });
        } catch (err) {
            console.log('Error in passport strategy:', err);
            return done(err);
        }
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});