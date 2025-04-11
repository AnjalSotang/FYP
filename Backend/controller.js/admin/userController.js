const { Op, Sequelize } = require("sequelize");
const { users, workout, userWorkout, sequelize } = require('../../models/index')
const { Users } = require("lucide-react");

const getAllUsers = async (req, res) => {
    try {
        const Users = await users.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'username', 'email', 'role', 'isActive', 'createdAt', 'profileImage']
        });

        if (!Users.length) {
            return res.status(404).json({ message: "No users found" });
        }

        // Transform data to match your desired output structure
        const formattedUsers = Users.map(user => ({
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
            status: user.isActive ? 'active' : 'inactive',
            joined: new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            avatar: user.profileImage || "/placeholder.svg?height=40&width=40"
        }));

        res.status(200).json({
            data: formattedUsers
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
};

const getUsersSevenDays = async (req, res) => {
    try {
        // Calculate date from 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const Users = await users.findAll({
            where: {
                createdAt: {
                    [Op.gte]: sevenDaysAgo // Op.gte = greater than or equal to
                }
            },
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'username', 'email', 'role', 'isActive', 'createdAt', 'profileImage']
        });

        if (!Users.length) {
            return res.status(404).json({ message: "No new users found in the past 7 days" });
        }

        // Transform data to match your desired output structure
        const formattedUsers = Users.map(user => ({
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
            status: user.isActive ? 'active' : 'inactive',
            joined: new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            avatar: user.profileImage || "/placeholder.svg?height=40&width=40"
        }));

        res.status(200).json({
            data: formattedUsers
        });
    }
    catch (error) {
        console.error("Error fetching recent users:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, status } = req.body;
        
        // Validate the provided ID
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the user
        const user = await users.findByPk(id);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }

        // Prepare update data - only include fields that are provided
        const updateData = {};
        
        if (name !== undefined) {
            updateData.username = name;
        }
        
        if (email !== undefined) {
            // Check if email is already in use by another user
            if (email !== user.email) {
                const existingUser = await users.findOne({ 
                    where: { 
                        email,
                        id: { [Op.ne]: id } // Exclude current user from check
                    } 
                });
                
                if (existingUser) {
                    return res.status(400).json({ message: "Email is already in use" });
                }
            }
            updateData.email = email;
        }
        
        if (role !== undefined) {
            // Validate role if needed
            const validRoles = ['admin', 'user', 'manager']; // Adjust based on your system's roles
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Invalid role specified" });
            }
            updateData.role = role;
        }
        
        if (status !== undefined) {
            // Convert status string to boolean for isActive field
            if (status === 'active') {
                updateData.isActive = true;
            } else if (status === 'inactive') {
                updateData.isActive = false;
            } else {
                return res.status(400).json({ message: "Status must be either 'active' or 'inactive'" });
            }
        }
        
        // If no fields to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }
        
        // Update the user
        await user.update(updateData);
        
        res.status(200).json({
            message: "User updated successfully"
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate the provided ID
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        
        // Find the user
        const user = await users.findByPk(id);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }
        
        // Delete the user
        await user.destroy();
        
        res.status(200).json({
            message: "User deleted successfully",
            data: { id }
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
};

const getUserMetrics = async (req, res) => {
    try {
        // Get current date and date from last month
        const currentDate = new Date();
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        
        // Count total users
        const totalUsers = await users.count();
        
        // Count users created in the last month
        const lastMonthUsers = await users.count({
            where: {
                createdAt: {
                    [Op.gte]: lastMonthDate
                }
            }
        });
        
        // Calculate percentage growth compared to previous month
        const previousMonthStart = new Date(lastMonthDate);
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
        
        const previousMonthUsers = await users.count({
            where: {
                createdAt: {
                    [Op.between]: [previousMonthStart, lastMonthDate]
                }
            }
        });
        
        // Calculate growth percentage
        let growthPercentage = 0;
        if (previousMonthUsers > 0) {
            growthPercentage = Math.round((lastMonthUsers - previousMonthUsers) / previousMonthUsers * 100);
        } else if (lastMonthUsers > 0) {
            growthPercentage = 100; // If there were no users before but there are now, it's 100% growth
        }
        
        // Format the growth string
        const growthString = `${growthPercentage >= 0 ? '+' : ''}${growthPercentage}% from last month`;
        
        // Format the total users with commas
        const formattedTotal = totalUsers.toLocaleString();
        
        res.status(200).json({
            title: "Total Users",
            value: formattedTotal,
            description: growthString,
            icon: "Users"
        });
    } catch (error) {
        console.error("Error fetching user metrics:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
};

const getUserGrowthData = async (req, res) => {
    try {
        // Get query parameters with defaults
        const { days = 30, interval = 5 } = req.query;
        const daysInt = parseInt(days);
        const intervalInt = parseInt(interval);
        
        // Calculate the date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysInt);
        
        // Create array of date checkpoints
        const dateCheckpoints = [];
        for (let i = 0; i <= daysInt; i += intervalInt) {
            const checkpointDate = new Date(startDate);
            checkpointDate.setDate(checkpointDate.getDate() + i);
            dateCheckpoints.push(checkpointDate);
        }
        
        // Make sure the last checkpoint is today if not already
        if (dateCheckpoints[dateCheckpoints.length - 1].toDateString() !== endDate.toDateString()) {
            dateCheckpoints.push(endDate);
        }
        
        // Get cumulative user count for each checkpoint
        const chartData = [];
        
        for (let i = 0; i < dateCheckpoints.length; i++) {
            const checkpoint = dateCheckpoints[i];
            
            // Count users created on or before this checkpoint
            const userCount = await users.count({
                where: {
                    createdAt: {
                        [Op.lte]: checkpoint
                    }
                }
            });
            
            // Format date for display (e.g., "Jan 15")
            const formattedDate = checkpoint.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            
            chartData.push({
                date: formattedDate,
                users: userCount
            });
        }
        
        res.status(200).json({
            data: chartData
        });
    } catch (error) {
        console.error("Error fetching user growth data:", error);
        res.status(500).json({
            message: "An internal server error occurred. Please try again later.",
            error: error.message
        });
    }
};







module.exports = { 
    getAllUsers,
    updateUser,
    deleteUser,
    getUserMetrics,
    getUserGrowthData,
    getUsersSevenDays
};