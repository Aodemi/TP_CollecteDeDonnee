import bcrypt from "bcrypt";
import { connectDB } from "../../config/db";
import { UserModel } from "../models/User";
import { MovieModel } from "../models/Movie";
import { SeriesModel } from "../models/Series";
import { SeasonModel } from "../models/Season";
import { EpisodeModel } from "../models/Episode";
import { RatingModel } from "../models/Rating";

// Seed script — add admin/user + sample movies/series/seasons/episodes/ratings
async function ensureAdmin() {
  const email = "admin@example.com";
  const exists = await UserModel.findOne({ email });
  if (!exists) {
    const passwordHash = await bcrypt.hash("Admin#123", 10);
    await UserModel.create({ email, username: "admin", passwordHash, role: "admin" });
    console.log("Seeded admin user: admin@example.com / Admin#123");
  } else {
    console.log("Admin already exists");
  }
}

async function ensureUser() {
  const email = "user@example.com";
  const exists = await UserModel.findOne({ email });
  if (!exists) {
    const passwordHash = await bcrypt.hash("User#123", 10);
    await UserModel.create({ email, username: "user", passwordHash, role: "user" });
    console.log("Seeded user: user@example.com / User#123");
  } else {
    console.log("User already exists");
  }
}

async function ensureMovies() {
  const samples = [
    { title: "Inception", genres: ["Sci-Fi", "Thriller"], synopsis: "A dream within a dream.", durationMin: 148, releaseDate: new Date("2010-07-16") },
    { title: "Interstellar", genres: ["Sci-Fi", "Drama"], synopsis: "To save humanity, go beyond.", durationMin: 169, releaseDate: new Date("2014-11-07") },
    { title: "The Dark Knight", genres: ["Action", "Crime"], synopsis: "Batman vs Joker.", durationMin: 152, releaseDate: new Date("2008-07-18") },
  ];
  for (const m of samples) {
    const found = await MovieModel.findOne({ title: m.title });
    if (!found) {
      await MovieModel.create(m as any);
      console.log("Seeded movie:", m.title);
    }
  }
}

async function ensureSeriesTree() {
  // Series with 1 season and 3 episodes
  const sTitle = "The Sample Series";
  let series = await SeriesModel.findOne({ title: sTitle });
  if (!series) {
    series = await SeriesModel.create({ title: sTitle, genres: ["Drama"], status: "ongoing" });
    console.log("Seeded series:", sTitle);
  }

  let season = await SeasonModel.findOne({ seriesId: series._id, seasonNo: 1 });
  if (!season) {
    season = await SeasonModel.create({ seriesId: series._id, seasonNo: 1, episodes: 3 });
    console.log("Seeded season S1 for:", sTitle);
  }

  const eps = [
    { epNo: 1, title: "Pilot", durationMin: 45 },
    { epNo: 2, title: "Second Wind", durationMin: 44 },
    { epNo: 3, title: "Plot Thickens", durationMin: 46 },
  ];
  for (const e of eps) {
    const found = await EpisodeModel.findOne({ seriesId: series._id, seasonId: season._id, epNo: e.epNo });
    if (!found) {
      await EpisodeModel.create({ ...e, seriesId: series._id, seasonId: season._id });
      console.log(`Seeded episode S1E${e.epNo} for:`, sTitle);
    }
  }

  return { seriesId: series._id, seasonId: season._id };
}

async function ensureRatings() {
  const user = await UserModel.findOne({ email: "user@example.com" });
  if (!user) return;

  const movie = await MovieModel.findOne({ title: "Inception" });
  if (movie) {
    const existing = await RatingModel.findOne({ userId: user._id, target: "movie", targetId: movie._id });
    if (!existing) {
      await RatingModel.create({ userId: user._id, target: "movie", targetId: movie._id, score: 9, review: "Mind-bending!" });
      console.log("Seeded rating for movie Inception by user@example.com");
    }
  }

  // rate first episode if exists
  const ep = await EpisodeModel.findOne({ epNo: 1 });
  if (ep) {
    const rex = await RatingModel.findOne({ userId: user._id, target: "episode", targetId: ep._id });
    if (!rex) {
      await RatingModel.create({ userId: user._id, target: "episode", targetId: ep._id, score: 8, review: "Nice pilot" });
      console.log("Seeded rating for episode S1E1 by user@example.com");
    }
  }
}

async function run() {
  await connectDB();
  await ensureAdmin();
  await ensureUser();
  await ensureMovies();
  await ensureSeriesTree();
  await ensureRatings();
  console.log("Seed completed.");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
