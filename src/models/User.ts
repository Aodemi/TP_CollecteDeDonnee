import { Media } from "./Media";

export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public role: "admin" | "user" = "user",
    public favorites: Media[] = []
  ) {}

  // Ajouter un média aux favoris
  addFavorites(media: Media): void {
    if (!this.favorites.find((fav) => fav.id === media.id)) {
      this.favorites.push(media);
    }
  }

  // Retirer un média des favoris
  removeFavorites(mediaId: string): void {
    this.favorites = this.favorites.filter((fav) => fav.id !== mediaId);
  }
}
