import { createClient } from 'redis';
import { REDIS } from './config';

const redisClient = createClient({
  username: REDIS.USERNAME,
  password: REDIS.PASSWORD,
  socket: {
    host: REDIS.HOST,
    port: REDIS.PORT 
  }
});

redisClient.on('error', err => console.log('Redis Client Error', err));


redisClient.connect().then(() => {
  console.log('Redis connected');
});

export default redisClient;
