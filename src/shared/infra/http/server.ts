import 'reflect-metadata';
import 'dotenv/config';

import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import routes from './routes';
import {errors} from 'celebrate';

import '../typeorm';
import '../../container';
import multerConfig from '../../../config/multer';
import AppError from '../../errors/AppError';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/files', express.static(multerConfig.uploadsFolder));
app.use(rateLimiter);

app.use(errors());

app.use((err: Error, request: Request, response: Response, next: NextFunction)=>{
    if(err instanceof AppError){
        return response.status(err.status).json({
            status: "error",
            message: err.message
        })
    }else{
        return response.status(500).json({
            status: "error",
            message: err.message
        })
    }
})

app.listen(3333, ()=>{
    console.log('Servidor iniciado com sucesso!');
})