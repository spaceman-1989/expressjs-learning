import { Router } from "express";
import { products } from "../utils/constants.mjs";

const router = Router();

router.get("/api/products", (req, res) => {
    if (req.cookies.hello && req.cookies.hello === "world")
    return res.send(products);
return res.status(403).send({msg: "sory you need the correct cookie"})
    
});


export default router;