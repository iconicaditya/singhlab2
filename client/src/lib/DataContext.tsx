import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

// Define Data Types
export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  tags: string[];
  image: string;
  status: string;
  year: string;
  impact: string;
  paperUrl?: string;
  paperDetails?: {
    title: string;
    authors: string[];
    abstract: string;
    doi: string;
    journal: string;
    date: string;
  };
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
    facebook?: string;
  };
}

export interface Publication {
  id: number;
  title: string;
  journal: string;
  year: string;
  authors: string[];
  type: string;
  tags: string[];
  abstract: string;
  doi: string;
  pdfUrl?: string | null;
  linkUrl?: string | null;
}

export interface GalleryItem {
  id: number;
  src: string;
  category: string;
  title: string;
}

export interface Message {
  id: number;
  sender: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "Read" | "Unread" | "Replied";
  category: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  titleKey: string;
  subtitleKey: string;
}

export interface SiteData {
  team: TeamMember[];
  publications: Publication[];
  gallery: GalleryItem[];
  messages: Message[];
  research: ResearchTopic[];
  projects: Project[];
}

export interface Author {
  name: string;
  image?: string;
}

export interface ResearchSection {
  id: string;
  title: string;
  content: string;
  image?: string;
}

export interface ResearchTopic {
  id: number;
  title: string;
  category: string;
  year: number;
  description: string;
  image: string;
  abstract: string;
  authors: Author[];
  doi: string;
  journal: string;
  sections: ResearchSection[];
  relatedPublicationIds: number[];
  references: string[];
}

// Initial Data Structure
const defaultData: SiteData = {
  team: [],
  publications: [],
  gallery: [],
  messages: [],
  research: [],
  projects: []
};

// Context Definition
interface DataContextType {
  data: SiteData;
  updateData: (section: keyof SiteData, newData: any[]) => void;
  resetData: () => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [team, publications, gallery, messages, research, projects] = await Promise.all([
          api.team.getAll().catch((err) => { console.error("Team fetch error:", err); return []; }),
          api.publications.getAll().catch((err) => { console.error("Pubs fetch error:", err); return []; }),
          api.gallery.getAll().catch((err) => { console.error("Gallery fetch error:", err); return []; }),
          api.messages.getAll().catch((err) => { console.error("Messages fetch error:", err); return []; }),
          api.research.getAll().catch((err) => { console.error("Research fetch error:", err); return []; }),
          api.projects.getAll().catch((err) => { console.error("Projects fetch error:", err); return []; })
        ]);

        setData({
          team,
          publications,
          gallery,
          messages,
          research,
          projects
        });
      } catch (error) {
        console.error('Failed to load data from API:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateData = (section: keyof SiteData, newData: any[]) => {
    setData(prev => ({
      ...prev,
      [section]: newData
    }));
  };

  const resetData = async () => {
    try {
      await Promise.all([
        ...data.team.map(t => api.team.delete(t.id).catch(() => {})),
        ...data.publications.map(p => api.publications.delete(p.id).catch(() => {})),
        ...data.gallery.map(g => api.gallery.delete(g.id).catch(() => {})),
        ...data.messages.map(m => api.messages.delete(m.id).catch(() => {})),
        ...data.research.map(r => api.research.delete(r.id).catch(() => {})),
        ...data.projects.map(p => api.projects.delete(p.id).catch(() => {})),
      ]);
      setData(defaultData);
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  };

  return (
    <DataContext.Provider value={{ data, updateData, resetData, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
