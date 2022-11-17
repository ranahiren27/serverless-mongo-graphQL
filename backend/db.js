import * as mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://root:toor@cluster0.lbncg55.mongodb.net/test",
            { useNewUrlParser: true }
        );
        console.log('The Connection is Ok');
    } catch (err) {
        console.log(`${err} Could not Connect to the Database. Exiting Now...`);
        process.exit();
    }
}

export default connectDB;