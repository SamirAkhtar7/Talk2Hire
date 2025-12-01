
import express from 'express';
// import dotenv from 'dotenv';
import { ENV } from './lib/env.js';

// dotenv.config();

const app = express();


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running ' });
}
);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});




