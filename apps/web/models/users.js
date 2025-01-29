import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
});

const PackageSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  dailyIncome: {
    type: Number,
  },
});

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  referral: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lastActivity: {
    type: Date,
  },
  status: {
    type: String,
    default: 'INACTIVE',
  },
  membership: {
    type: PackageSchema,
    default: () => ({}),
  },
  firstPackagePrice: {
    type: Number,
    default: 0,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  earnings: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  wallet: {
    type: WalletSchema,
  },
  receiveWallet: {
    type: String,
  },
  joinedAt: {
    type: Date,
  },
});

export default mongoose.models.Users ||
  mongoose.model('Users', UsersSchema, 'Users');
