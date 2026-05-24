import mongoose from 'mongoose';
const { model, Schema } = mongoose;
// Interfaces:
import { IDeposit } from '@a3drian/spendit-shared';

const depositSchema = new Schema<IDeposit>(
	{
		owner: { type: String, required: true },

		amount: { type: Number, required: true },
		currency: { type: String, required: false },

		details: { type: String, required: true },
		createdAt: { type: Date, required: true },

		category: { type: String, required: true },

		refundable: { type: Boolean, required: false },
		refunded: { type: Boolean, required: false }
	},
	{
		collection: 'Deposits',
		versionKey: '_ver'
	}
);

const DepositModel = model<IDeposit>('Deposit', depositSchema);

export { DepositModel };
