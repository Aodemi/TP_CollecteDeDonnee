import { Episode } from "./Episode";

export class Saison {
  constructor(
    public seasonNumber: number,
    public releaseDate: Date,
    public episodes: Episode[] = []
  ) {}
}
