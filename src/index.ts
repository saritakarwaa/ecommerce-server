import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/userRoutes";
import sellerRoutes from "./routes/sellerRoutes";
import adminRoutes from "./routes/adminRoutes";


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/sellers", sellerRoutes);
app.use("/admins", adminRoutes);


app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
