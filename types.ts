// For Playlist Manager
export interface Playlist {
  id: number;
  title: string;
  description: string;
  items: number;
  created: string; // YYYY-MM-DD
  modified: string; // YYYY-MM-DD
  status: 'Active' | 'Inactive' | 'Draft';
}

export interface PlaylistItem {
  id: number;
  thumb: string;
  show: string;
  season: string;
  ep: string;
  source: string;
  status: 'Active' | 'Inactive';
  type: string; // e.g. 'SVOD', 'AVOD'
}


// For Carousel Builder
export interface RouteNode {
  id: string;
  type: 'folder' | 'page';
  name: string;
  status?: 'active' | 'inactive';
  count: number;
  parentId: string | null;
  children?: RouteNode[];
}

export interface RegionConfig {
    selectedRegion: string;
    included: string[];
    excluded: string[];
}

export interface CarouselVariant {
    id: string;
    weight: number;
    editorialName: string;
    carouselCompType: string;
    packages: string[];
    age: string[];
    deviceType: string[];
    regionConfig: RegionConfig;
    recommendationType: string;
    vodAvailable: boolean;
    allowPrevious: boolean;
    removePrevious: boolean;
    episodeOrder: boolean;
    includeExclude: string;
    avodSvod: string;
}

export interface ABTestConfig {
    enabled: boolean;
    durationDays: number;
}

export interface Carousel {
  id: string;
  editorialName: string;
  type: string;
  position: number;
  items: number;
  platforms: string[];
  recommendationType: string;
  avodSvod: string;
  status: 'Active' | 'Inactive' | 'Draft';
  pinned: boolean;
  modified: string; // YYYY-MM-DD
  variants: CarouselVariant[];
  abTestConfig?: ABTestConfig;
}

// For User Management
export type Module = 'Dashboard' | 'Playlist Manager' | 'Carousel Builder' | 'Recommendation Config' | 'Preview Tool' | 'User Management' | 'Settings';
export const ALL_MODULES: Module[] = ['Dashboard', 'Playlist Manager', 'Carousel Builder', 'Recommendation Config', 'Preview Tool', 'User Management', 'Settings'];

export type Permission = 'All' | 'Create' | 'Read' | 'Update' | 'Delete';
export const ALL_PERMISSIONS: Exclude<Permission, 'All'>[] = ['Create', 'Read', 'Update', 'Delete'];


export interface Role {
    id: string;
    name: string;
    permissions: Partial<Record<Module, Permission[]>>;
    createdOn: string; // ISO date string
    updatedOn: string; // ISO date string
}

export interface User {
    id: string;
    username: string;
    email: string;
    roleId: string;
    status: 'Active' | 'Inactive';
    userType: 'Publisher' | 'Content Partner';
    projects: ('Production' | 'Staging')[];
    createdOn: string; // ISO date string
}

// For Preview Tool & general content
export interface ContentItem {
    id: string;
    title: string;
    imageUrl?: string;
    duration: string; // e.g., "1h 30m"
    type: 'Movie' | 'Series' | 'Episode';
    contentType: string;
    metadata: Record<string, string[]>;
}

export interface PreviewProfile {
    userId: string;
    username?: string;
    country: string;
    timezone: string;
    userType: string;
    packageType: string;
}

export interface ActionLog {
    timestamp: Date;
    action: 'play' | 'like' | 'share' | 'download';
    contentTitle: string;
    details?: string;
}

export type UserInterestProfile = Record<string, number>;