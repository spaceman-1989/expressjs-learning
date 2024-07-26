import {Router} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from 'express-validator';
import {User} from "../mongoose/schemas/user.mjs";

const router = Router();

// Register a new user
router.post("/register", 
[
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({min: 3}).withMessage('Password must be at least 3 character'),

],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({
            name,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: "1h"},
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );



        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
        
    }
}
);

// Authenticate a user and get token
router.post("/login",
[
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please include a valid password").isLength({ min: 3 }),
],
async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Set session data
        req.session.userId = user._id;
        req.session.email = user.email;

        
        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: "1h"},
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }

    
    }


);


// Check login status
router.get('/status', (req, res) => {
    if (req.session && req.session.userId) {
      res.status(200).send({ loggedIn: true });
    } else {
      res.status(200).send({ loggedIn: false });
    }
  });

export default router;

