export abstract class Media {
  constructor(
    public id: string,
    public title: string,
    public genre: string,
    public year: number,
    public rating: number
  ) {}

  // Méthode abstraite pour obtenir un résumé du média
  abstract getSummary(): string;
}
