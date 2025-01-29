import mongoose from 'mongoose';

const DepositsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'Users', // Reference the Users collection
      required: true,
    },
    amount: {
      type: Number, // Deposit amount
      required: true,
    },
    transactionId: {
      type: String, // Blockchain transaction ID
      required: true,
      //  unique: true, // Ensures no duplicate transaction IDs
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'], // Status options
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set timestamp
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically updated on save
    },
  },
  { timestamps: true },
);

export default mongoose.models.Deposits ||
  mongoose.model('Deposits', DepositsSchema, 'Deposits');
