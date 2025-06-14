import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/userRoutes";
import sellerRoutes from "./routes/sellerRoutes";
import adminRoutes from "./routes/adminRoutes";
import productRoutes from "./routes/productRoutes"
import orderRoutes from "./routes/orderRoutes"
import cartRoutes from "./routes/cartRoutes"
import transactionRoutes from "./routes/transactionRoutes"
import statsRoutes from "./routes/statsRoutes"
const app = express();
const port = 3000;

const allowedOrigins = ["http://localhost:5173", ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admins", adminRoutes);
app.use('/api/products',productRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/cart',cartRoutes)
app.use("/api/transactions",transactionRoutes)
app.use("/api/stats",statsRoutes)


app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
