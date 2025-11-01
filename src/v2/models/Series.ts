// Schema Mongoose Series V2
import mongoose, { Schema, Document } from "mongoose";

export interface ISeries extends Document {
  title: string;
  genres: string[];
  status: "ongoing" | "ended";
}

const SeriesSchema = new Schema<ISeries>(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 200, index: true },
    genres: [{ type: String, minlength: 1, maxlength: 30, index: true }],
    status: { type: String, enum: ["ongoing", "ended"], required: true },
  },
  { timestamps: true }
);

// indexes via options (title, genres)

export const SeriesModel = mongoose.model<ISeries>("Series", SeriesSchema);
