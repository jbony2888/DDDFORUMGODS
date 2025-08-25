import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema(
  {
    // renamed from "model" to avoid collision with Document#model()
    seqName: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 0 },
  },
  { versionKey: false }
);

export const Counter = (mongoose as any).model('Counter', CounterSchema);

// Atomic increment helper
export async function getNextSequence(seqName: string): Promise<number> {
  const doc = await Counter.findOneAndUpdate(
    { seqName },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
  return doc!.value;
}
