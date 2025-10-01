import { Media } from "./Media";

export class Film extends Media {
  constructor(
    id: string,
    title: string,
    genre: string,
    year: number,
    rating: number,
    public duration: number,
    public watched: boolean = false
  ) {
    super(id, title, genre, year, rating);
  }

  // Résumé du film
  getSummary(): string {
    return `${this.title} (${this.year}) - ${this.genre}, ${this.duration} min, Note: ${this.rating}`;
  }
}
