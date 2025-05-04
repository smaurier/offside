export interface Club {
  id: string;
  name: string;
  latitude: number; // Added latitude for map markers
  longitude: number; // Added longitude for map markers
  altName: [string];
  isoCountry: string;
  city: string;
  fondationDate: string;
  lat: number;
  long: number;
  logo: string;
  social: [string];
  owner: string;
  imageHero: string;
  lastUpdated: string;
  marketValue: number;
  colors: [string];
  idLeagueUEFA: string;
  idStadium: string;
  UEFACode: string;
  website: string;
}
