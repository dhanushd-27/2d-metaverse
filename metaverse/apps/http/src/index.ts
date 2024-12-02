import express, { Request, Response } from "express";
import { spaceRoutes } from "./routes/space.routes";
import { adminRoutes } from "./routes/admin.routes";
import { generalRoutes } from "./routes/general.routes";
import { userRoutes } from "./routes/user.routes";
import dotenv from "dotenv"

dotenv.config()

const app = express();

app.use(express.json());

app.use('', generalRoutes);
app.use('/user', userRoutes)
app.use('/admin', adminRoutes);
app.use('/space', spaceRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello Turborepo")
})

app.listen(3000, () => {
    console.log(`Server is listening on port ${3000}`);
    console.log(`http://localhost:3000/`);
})