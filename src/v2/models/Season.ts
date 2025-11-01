// Schema Mongoose Season V2
import mongoose, { Schema, Document } from "mongoose";

export interface ISeason extends Document {
  seriesId: mongoose.Types.ObjectId;
  seasonNo: number; // >=1
  episodes: number; // nb théorique (>=0)
}

const SeasonSchema = new Schema<ISeason>(
  {
    seriesId: { type: Schema.Types.ObjectId, ref: "Series", required: true, index: true },
    seasonNo: { type: Number, min: 1, required: true },
    episodes: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

// index via option sur seriesId

export const SeasonModel = mongoose.model<ISeason>("Season", SeasonSchema);
