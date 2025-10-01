import { Media } from "./Media";
import { Saison } from "./Saison";

export class Serie extends Media {
  constructor(
    id: string,
    title: string,
    genre: string,
    year: number,
    rating: number,
    public status: "en_attente" | "en_cours" | "terminee",
    public saisons: Saison[] = []
  ) {
    super(id, title, genre, year, rating);
  }

  // Résumé de la série
  getSummary(): string {
    return `${this.title} (${this.year}) - ${this.genre}, ${this.saisons.length} saison(s), Statut: ${this.status}`;
  }

  // Marquer un épisode comme regardé
  markEpisodeAsWatched(episodeId: string): boolean {
    for (const saison of this.saisons) {
      const episode = saison.episodes.find((ep) => ep.id === episodeId);
      if (episode) {
        episode.watched = true;
        return true;
      }
    }
    return false;
  }
}
