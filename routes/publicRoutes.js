import Router from "koa-router";
import { main as getAIResponse } from "../Services/AI.js"; // Import your AI function
import { Parser } from "expr-eval";
import { Units } from "../DB models/units.js";

const router = new Router();

// Helper function to escape special characters for regex, preventing ReDoS attacks.
const escapeRegex = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

router.get('/api/categories', async (ctx) => {
    try {
        const categories = await Units.distinct("category");
        ctx.body = categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        ctx.status = 500;
        ctx.body = {error: "Failed to fetch categories: " + error.message};
    }
});

router.get('/api/categories/:category', async (ctx) => {
    try {
        const categoryParam = ctx.params.category;
        if (!categoryParam) {
            ctx.status = 400;
            ctx.body = { error: "Category parameter is missing" };
            return;
        }
        const escapedCategory = escapeRegex(categoryParam);
        const conversionType = await Units.find({
            // It's good practice to sanitize or validate parameters
            // Use a case-insensitive regex to match the category
            category: new RegExp('^' + escapedCategory + '$', 'i')
        });
        if (conversionType.length === 0) {
            ctx.status = 404;
            ctx.body = { error: `No conversions found for category: ${categoryParam}` };
            return;
        }
        ctx.body = conversionType;
    } catch (error) {
        console.error("Error fetching conversions by category:", error);
        ctx.status = 500;
        ctx.body = {error: "Failed to fetch conversions: " + error.message};
    }
});

router.post('/api/convert', async (ctx) => {
    try {
        const { category, fromUnit, toUnit, input } = ctx.request.body;
        
        if (!category || !fromUnit || !toUnit || input === undefined || input === null) {
            ctx.status = 400;
            ctx.body = { error: "Missing required fields: category, fromUnit, toUnit, input" };
            return;
        }

        if (typeof input !== 'number') {
            ctx.status = 400;
            ctx.body = { error: "The 'input' field must be a number." };
            return;
        }

        const conversion = await Units.findOne({
            category,
            fromUnit,
            toUnit
        });
        
        if (!conversion) {
            ctx.status = 404;
            ctx.body = {error: "Conversion definition not found for the given units and category"};
            return;
        }
        
        const parser = new Parser();
        const expression = parser.parse(conversion.formula);
        const result = expression.evaluate({ [conversion.parameter]: input });
        
        ctx.body = {
            result,
            from: fromUnit,
            to: toUnit,
            original: input,
        };
    } catch (error) {
        console.error("Error during conversion:", error);
        // Check for common formula-related errors from expr-eval
        if (error.message.includes('parse error') || error.message.includes('undefined')) {
            ctx.status = 400;
            ctx.body = { error: `Invalid conversion formula: ${error.message}` };
        } else {
            ctx.status = 500;
            ctx.body = {error: "An unexpected error occurred during conversion: " + error.message};
        }
    }
});

router.post('/api/chat', async (ctx) => {
    try {
        const { prompt } = ctx.request.body;
        if (!prompt) {
            ctx.status = 400;
            ctx.body = { error: "Prompt is required" };
            return;
        }

        const aiMessage = await getAIResponse(prompt);
        ctx.body = { message: aiMessage };

    } catch (error) {
        console.error("[publicRoutes.js] Error in AI chat endpoint:", error); // Added prefix
        console.error("[publicRoutes.js] Error details:", error.message, error.stack); // Log details
        // Avoid sending detailed internal errors to the client in production
        ctx.status = 500;
        ctx.body = { error: "An error occurred while processing your request." };
        console.log("[publicRoutes.js] Sent 500: Internal server error response body:", ctx.body); // Log the body being sent
    }
});

export default router;
