import express, { Request, Response } from "express";
import { spaceRoutes } from "./routes/space.routes";
import { adminRoutes } from "./routes/admin.routes";
import { generalRoutes } from "./routes/general.routes";
import { userRoutes } from "./routes/user.routes";
import dotenv from "dotenv"

dotenv.config()

const app = express();

app.use(express.json());

app.use('api/v1/', generalRoutes);
app.use('api/v1/user', userRoutes)
app.use('api/v1/admin', adminRoutes);
app.use('api/v1/space', spaceRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello Turborepo")
})

app.listen(3000, () => {
    console.log(`Server is listening on port ${3000}`);
    console.log(`http://localhost:3000/`);
})