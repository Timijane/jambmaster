export type HomepageSettings = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    images: string[];
    imageMediaIds?: (string | null)[];
    imageRotationSeconds: number;
  };

  announcement: {
    enabled: boolean;
    items: string[];
    rotationSeconds: number;
  };

  about: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageMediaId?: string;
  };

  method: {
    eyebrow: string;
    title: string;
    description: string;
  };

  features: {
    eyebrow: string;
    title: string;
    description: string;
  };

  learning: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageMediaId?: string;
  };

  cbt: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageMediaId?: string;
  };

  battle: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageMediaId?: string;
  };

  aiCoach: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageMediaId?: string;
  };

  analytics: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageMediaId?: string;
  };

  community: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageMediaId?: string;
  };

  mission: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageMediaId?: string;
  };

  finalCta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };

  footer: {
    description: string;
    managedBy: string;
    copyright: string;
  };
};
