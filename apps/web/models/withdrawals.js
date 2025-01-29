import mongoose from 'mongoose';

const WidthdrawalsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'Users', // Reference the Users collection
      required: true,
    },
    username: {
      type: String,
    },
    wallet: {
      type: String,
    },
    amount: {
      type: Number, // Deposit amount
      required: true,
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

export default mongoose.models.Widthdrawals ||
  mongoose.model('Widthdrawals', WidthdrawalsSchema, 'Widthdrawals');
