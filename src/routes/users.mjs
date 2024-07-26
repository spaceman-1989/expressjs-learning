import { Router } from "express";
import { mockusers } from "../utils/constants.mjs";
// import createUserValidation from "../utils/createUserValidation.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import auth from '../middleware/auth.mjs';

const router = Router();

router.get("/api/users", (req, res) => {
    console.log(req.query);
    console.log(req.session.id);

    const { query: { filter, value } } = req;
    // when filter and value are undefined
    if (!filter && !value) return res.send(mockusers);

    if (filter && value)
        return res.send(
            mockusers.filter(user => user[filter].toLowerCase().includes(value.toLowerCase()))
        );
});


router.post("/api/users", async (req, res) => {
     const { body } = req;
     const newUser = new User(body);
     try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
     } catch (error) {
        return res.status(400).send(error.message);
     }
});


router.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    if (isNaN(Number(id)))
        return res.status(400).send({ msg: "Bad Request. Invalid id" });
    const user = mockusers.find(user => user.id === Number(id));
    if (!user) return res.sendStatus(404);
    return res.send(user);
});

router.put("/api/users/:id", (req, res) => {
    const { body, params: { id } } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(404);
    const userIndex = mockusers.findIndex(user => user.id === parsedId);
    if (userIndex === -1) return res.sendStatus(404);
    const updatedUser = { ...mockusers[userIndex], ...body };
    mockusers[userIndex] = updatedUser;
    return res.sendStatus(200);
});


router.delete("/api/users/:id", (req, res) => {
    const { params: { id } } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(404);
    const userIndex = mockusers.findIndex(user => user.id === parsedId);
    if (userIndex === -1) return res.sendStatus(404);
    mockusers.splice(userIndex, 1);
    return res.sendStatus(200);
});

export default router;

