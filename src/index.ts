import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { isDev, isProd, ALLOWED_ORIGINS, PORT } from './config';
// import appRoutes from './routes';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/info', (_req, res) => {
    res.send('Welcome to SaiBaby server');
});
// app.use('/', appRoutes);

(async () => {
    if (isDev) {
        app.use(cors());
    } else {
        app.use((req, res, next) => {
            const { origin } = req.headers;
            if (origin && ALLOWED_ORIGINS.indexOf(origin) > -1) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, cookie'
            );
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }
    let retries = 5;
    while (retries) {
        try {
            app.listen(PORT, () => {
                console.log(`listening on: http://localhost:${PORT}`);
            });
            break;
        } catch (err) {
            console.error(err);
            retries -= 1;
            console.log(`Retries left: ${retries}, retrying in 5 seconds.`);
            // wait 5 seconds
            // eslint-disable-next-line no-await-in-loop
            await new Promise((res) => setTimeout(res, 5000));
        }
    }
})();
