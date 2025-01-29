import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Wallet ||
  mongoose.model('Wallet', WalletSchema, 'Wallet');
