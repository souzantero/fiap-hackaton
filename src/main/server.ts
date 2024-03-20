import dotenv from 'dotenv';
dotenv.config();

import { App } from './app';
import { environment } from './environment';

const app = App.create();
app.start(environment.port);
