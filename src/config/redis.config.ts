import { config } from 'dotenv';
import { Redis } from 'ioredis';
config();
const redisClient = () => {
	if (process.env.REDIS_ENDPOINTS) {
		console.log('redis connected');
		return process.env.REDIS_ENDPOINTS;
	} else throw new Error('Redis not connected');
};

export const redis = new Redis(redisClient());
