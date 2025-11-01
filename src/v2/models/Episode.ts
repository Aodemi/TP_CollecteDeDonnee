// Schema Mongoose Episode V2
import mongoose, { Schema, Document } from "mongoose";

export interface IEpisode extends Document {
  seriesId: mongoose.Types.ObjectId;
  seasonId: mongoose.Types.ObjectId;
  epNo: number; // >=1
  title: string;
  durationMin: number; // 1..300
}

const EpisodeSchema = new Schema<IEpisode>(
  {
    seriesId: { type: Schema.Types.ObjectId, ref: "Series", required: true, index: true },
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true, index: true },
    epNo: { type: Number, min: 1, required: true },
    title: { type: String, required: true, minlength: 1, maxlength: 200 },
    durationMin: { type: Number, min: 1, max: 300, required: true },
  },
  { timestamps: true }
);

// indexes via options (seriesId, seasonId)

export const EpisodeModel = mongoose.model<IEpisode>("Episode", EpisodeSchema);
