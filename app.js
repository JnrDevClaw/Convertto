import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from '@koa/cors';
import serve from 'koa-static';

// Import routes
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = new Koa();

app.use(bodyParser());
app.use(cors());
app.use(serve('public'));
app.use(serve('Views')); // Allows access to files in the Views directory

const isProd = process.env.NODE_ENV === 'production';

// Production security headers
if (isProd) {
    app.use(async (ctx, next) => {
        ctx.set('X-Content-Type-Options', 'nosniff');
        ctx.set('X-Frame-Options', 'DENY');
        ctx.set('X-XSS-Protection', '1; mode=block');
        await next();
    });
}

// Use the imported routers
app.use(publicRoutes.routes()).use(publicRoutes.allowedMethods());
app.use(adminRoutes.routes()).use(adminRoutes.allowedMethods());

export default app;