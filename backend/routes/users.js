import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const currentUserId = req.userid;

        const users = await User.find({
            _id: { $ne: currentUserId },
            isProfileSetup: true
        })
            .select('name displayName bio interests avatarUrl createdAt')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ users: users });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});


router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
            .select('name displayName bio interests avatarUrl createdAt');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Failed to fetch user profile" });
    }
});


export default router;
