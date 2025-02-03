import httpStatus from 'http-status';
import {User} from '../models/user.model.js';
import bcrypt , {hash} from 'bcrypt';
import crypto from 'crypto';

const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(httpStatus.BadRequest).json({ message: "Please provide email and password" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.NotFound).json({ message: "User does not exist" });
        }

        if(bcrypt.compare(password, existingUser.password)){
            let token = crypto.randomBytes(64).toString('hex');
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token });
        }

        res.status(httpStatus.OK).json({ result: existingUser });
    }catch(error){
        res.status(500).json({ message: `Something went wrong ${error}` });
    }
}

const register = async (req, res) => {
    const { email, password, name } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(httpStatus.Found).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(httpStatus.Created).json({ message: "User Registered successfully" });
    }catch(error){
        res.json({ message: `Something went wrong ${error}` });
    }
}

export { login, register };