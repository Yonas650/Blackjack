import express from 'express';
const app = express();


app.use(express.json())

import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);
