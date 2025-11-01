// Schema Mongoose Rating V2
import mongoose, { Schema, Document } from "mongoose";

export type RatingTarget = "movie" | "episode";

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  target: RatingTarget;
  targetId: mongoose.Types.ObjectId; // ref Film/Episode
  score: number; // 0..10
  review?: string; // max 2000
}

const RatingSchema = new Schema<IRating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    target: { type: String, enum: ["movie", "episode"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    score: { type: Number, min: 0, max: 10, required: true },
    review: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

// index sur targetId via option

export const RatingModel = mongoose.model<IRating>("Rating", RatingSchema);
