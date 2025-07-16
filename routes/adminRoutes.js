import Router from "koa-router";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../DB models/admin.js";
import { Units } from "../DB models/units.js";

const router = new Router();

const authAdmin = async (ctx, next) => {
    const auth = ctx.headers.authorization;
    if(!auth) {
        ctx.status = 401;
        ctx.body = {error: "Authentication required"};
        return;
    }
    if (!auth.startsWith('Bearer')) {
        ctx.status = 401;
        ctx.body = {error: "Authentication error You don't have a bearer header"};
        return;
    }        
        
    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // Attach the decoded payload (which contains the admin's username) to the context
        ctx.state.admin = decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            ctx.status = 401;
            ctx.body = { error: "Authentication failed: Token has expired" };
        } else if (error instanceof jwt.JsonWebTokenError) { // Catches other JWT errors like invalid signature
            ctx.status = 401;
            ctx.body = { error: `Authentication failed: ${error.message}` };
        } else {
            ctx.status = 500;
            ctx.body = { error: "An internal server error occurred during authentication" };
        }
        return; // Stop execution if auth fails
    }

    await next();
};


router.post('/api/admin/login', async(ctx) => {
    try {
        const {username, password} = ctx.request.body;
        if (!username || !password) {
            ctx.status = 400;
            ctx.body = { error: "Username and Password are required" };
            return;
        }
    
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            ctx.status = 401;
            ctx.body = { error: "Incorrect Credentials" };
            return;
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            ctx.status = 401;
            ctx.body = { error: "Incorrect Credentials" };
            return;
        }
        const token = jwt.sign({
            username: admin.username},
            process.env.JWT_KEY,
            {expiresIn: "1h"}
        )
        ctx.status = 200;
        ctx.body = {
            message: `Welcome Admin ${admin.username}`,
            token: token
        };      
    }
    catch (error) {
        console.error("Login error:", error);
        ctx.status = 500;
        ctx.body = {error: "An error occurred during login: " + error.message};
    }
});


router.put('/api/admin/conversions/:name', authAdmin, async(ctx) => {
    try {
        const conversionName = ctx.params.name;
        const updateData = ctx.request.body;

        const requiredFields = ['category', 'name', 'fromUnit', 'toUnit', 'formula', 'parameter'];
        
        if (requiredFields.some(field => updateData[field] === undefined || updateData[field] === null || updateData[field] === '')) {
            ctx.status = 400;
            ctx.body = { error: `All fields are required and cannot be empty: ${requiredFields.join(', ')}` };
            return;
        }

        // findOneAndUpdate will either update the doc (if name is unchanged or new)
        // or fail with a duplicate key error (if name conflicts with another doc).
        // This is handled by the unique index on the schema and the catch block below.
        const updated = await Units.findOneAndUpdate(
            { name: conversionName }, // Find by the name in the URL parameter
            updateData, // Update with new data
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updated) {
            ctx.status = 404;
            ctx.body = { error: "Conversion not found" };
            return;
        }

        ctx.body = {
            message: `${conversionName} updated successfully`,
            conversion: updated
        };
    }
    catch (error) {
        console.error("Error updating conversion:", error);
        if (error.code === 11000) {
            ctx.status = 409; // Conflict
            ctx.body = { error: `A conversion with the name '${ctx.request.body.name}' already exists.` };
        } else if (error.name === 'ValidationError') {
            ctx.status = 400;
            ctx.body = { error: error.message };
        } else {
            ctx.status = 500;
            ctx.body = { error: "An internal server error occurred: " + error.message };
        }
    }
});

router.post('/api/admin/conversions/', authAdmin, async(ctx) => {
    try {
        const conversionData = ctx.request.body;
        const { name } = conversionData;

        const requiredFieldNames = ['category', 'name', 'fromUnit', 'toUnit', 'formula', 'parameter'];
        
        if (requiredFieldNames.some(field => conversionData[field] === undefined || conversionData[field] === null || conversionData[field] === '')) {
            ctx.status = 400;
            ctx.body = { error: `All fields are required and cannot be empty: ${requiredFieldNames.join(', ')}` };
            return;
        }

        const conversion = new Units(conversionData);
        await conversion.save();
        ctx.status = 201; // HTTP 201 Created
        ctx.body = {
            message: `${name} added successfully`,
            conversion
        };
    } catch (error) {
        console.error("Error adding conversion:", error);
        if (error.code === 11000) { // Catch duplicate key error from MongoDB
            ctx.status = 409; // Conflict
            ctx.body = { error: "A conversion with this name already exists." };
        } else if (error.name === 'ValidationError') {
            ctx.status = 400;
            ctx.body = { error: error.message };
        } else {
            ctx.status = 500;
            ctx.body = { error: "An internal server error occurred: " + error.message };
        }
    }
});

router.delete('/api/admin/conversions/:name', authAdmin, async(ctx) => {
    try {
        const conversionName = ctx.params.name;
        const deleted = await Units.findOneAndDelete({ name: conversionName});

        if (!deleted) {
            ctx.status = 404;
            ctx.body = { error: `Conversion '${conversionName}' does not exist` }; // More informative
            return;
        }
        ctx.status = 204; // No Content
        // A 204 response should not have a body.
        ctx.body = null;
    }
    catch (error) {
        console.error("Error deleting conversion:", error);
        ctx.status = 500; // Internal server error for delete issues
        ctx.body = {error: "An internal server error occurred: " + error.message};
    }
});

export default router;
