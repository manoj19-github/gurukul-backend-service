import mongoose from 'mongoose';
const connectDB = async () => {
	try {
		await mongoose.set('strictQuery', true);
		await mongoose.connect(process.env.DATABASE_URL!, {
			// useNewUrlParser:true,
			// useUnifiedTopology:true,
			// directConnection:true,

			connectTimeoutMS: 15000
		});
	} catch (err) {
		console.log(`database not connected : ${err}`);
	}

	const { connection } = mongoose;
	if (connection.readyState >= 1) {
		console.log('database connected successfully');
		return;
	}
	connection.on('error', () => {
		console.log(`database not connected try again`);
	});
};
export default connectDB;
