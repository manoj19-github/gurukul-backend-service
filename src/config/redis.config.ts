import { Redis } from 'ioredis';

const redisClient = () => {
	if (process.env.REDIS_ENDPOINTS) {
		console.log('redis connected');
		return process.env.REDIS_ENDPOINTS;
	}
	throw new Error('Redis connected');
};

export const redis = new Redis(redisClient());
