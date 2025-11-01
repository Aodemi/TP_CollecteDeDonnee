// Schema Mongoose Movie V2
import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  genres: string[];
  synopsis?: string;
  releaseDate?: Date;
  durationMin: number; // 1..600 min
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 200, index: true },
    genres: [{ type: String, minlength: 1, maxlength: 30, index: true }],
    synopsis: { type: String },
    releaseDate: { type: Date },
    durationMin: { type: Number, min: 1, max: 600, required: true },
  },
  { timestamps: true }
);

// indexes via options (title, genres)

export const MovieModel = mongoose.model<IMovie>("Movie", MovieSchema);
