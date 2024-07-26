import { Router } from "express";


const router = Router();

router.get("/", (req, res) => {
    res.cookie("isim", "mustafa", { maxAge: 60000*60*2} );
    res.status(200).send({ msg: "hello" });
});


export default router;