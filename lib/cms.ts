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
  };

  cbt: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
  };

  battle: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
  };

  aiCoach: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
  };

  analytics: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
  };

  community: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
  };

  mission: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
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
