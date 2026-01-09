import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'jp';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Header
    'header.tagline': 'Research, education, and community action for a sustainable future.',
    'header.home': 'Home',
    'header.about': 'About',
    'header.team': 'Our Team',
    'header.research': 'Research',
    'header.themes': 'Research Themes',
    'header.areas': 'Research Areas',
    'header.publications': 'Publications',
    'header.projects': 'Projects',
    'header.resources': 'Resources',
    'header.activities': 'Activities',
    'header.gallery': 'Gallery',
    'header.contact': 'Contact',
    'header.admin': 'Admin',
    'header.menu': 'MENU',
    'header.adminLogin': 'Admin Login',

    // Hero
    'hero.slide1.title': 'Innovating for a Sustainable Future',
    'hero.slide1.subtitle': 'Research, Education, and Community Action',
    'hero.slide2.title': 'Understanding Environmental Challenges',
    'hero.slide2.subtitle': 'Addressing Climate Change & Biodiversity Loss',
    'hero.slide3.title': 'Community-Driven Solutions',
    'hero.slide3.subtitle': 'Engaging Local Voices for Global Impact',
    'hero.learnMore': 'Learn More',

    // About
    'about.title': 'About The Lab',
    'about.description': 'The Singh Lab is an interdisciplinary research group at Kobe City University of Foreign Studies focused on understanding and addressing environmental challenges through applied research, education, and community engagement.',
    'about.vision.title': 'Our Vision',
    'about.vision.text': 'To integrate research, teaching, and local action to reduce environmental risks and improve environmental and social well-being.',
    'about.mission.title': 'Our Mission',
    'about.mission.text': 'Produce high-quality policy-relevant research, train students in field methods, and engage communities in sustainability initiatives.',
    'about.approach.title': 'Our Approach',
    'about.approach.text': 'Mixed methods research grounded in real-world contexts, emphasizing impact beyond academia and linking environmental, social, and economic dimensions.',
    
    // Themes
    'themes.title': 'Research Themes',
    'themes.subtitle': 'Our interdisciplinary research spans multiple critical areas of environmental sustainability.',
    'themes.plastics': 'Plastics',
    'themes.waste': 'Waste Management',
    'themes.climate': 'Climate Change',
    'themes.energy': 'Renewable Energy & Tech',
    'themes.urban': 'Social & Urban Systems',
    'themes.others': 'Others',

    // Team
    'team.title': 'Our Team',
    'team.subtitle': 'A diverse group of researchers and students dedicated to environmental sustainability.',
    'team.pi': 'Principal Investigator',
    'team.researcher': 'Lead Researcher',
    'team.students': 'Student Research Group',
    'team.undergrad': 'Undergraduate Team',
    'team.bio1': 'Professor at Kobe City University of Foreign Studies. Expert in environmental policy and sustainability.',
    'team.bio2': 'Specializing in marine plastics and community engagement strategies.',
    'team.bio3': 'Passionate students engaging in field work and community projects.',

    // Publications
    'publications.title': 'Publications',
    'publications.pub1': 'Community perceptions of marine plastic pollution in Japan',
    'publications.pub2': 'Barriers to effective waste management in urban areas',
    'publications.pub3': 'Education for Sustainable Development: A case study',

    // Activities
    'activities.title': 'Recent Activities',

    // Collaborators
    'collaborators.title': 'Our Collaborators',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'For research collaboration, student opportunities, or community partnerships, please contact us via email or the contact form.',
    'contact.location': 'Location',
    'contact.locationValue': 'Kobe City University of Foreign Studies, Kobe, Japan',
    'contact.email': 'Email',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.emailPlaceholder': 'Your email',
    'contact.form.subjectPlaceholder': 'What is this regarding?',
    'contact.form.messagePlaceholder': 'Your message...',

    // Footer
    'footer.tagline': 'Research, education, and community action for a sustainable future. Bridging the gap between science and society.',
    'footer.quickLinks': 'Quick Links',
    'footer.contactUs': 'Contact Us',
    'footer.findUs': 'Find Us',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.rights': 'All rights reserved.',
  },
  jp: {
    // Header
    'header.tagline': '持続可能な未来のための研究、教育、そして地域活動。',
    'header.home': 'ホーム',
    'header.about': '研究室について',
    'header.team': 'メンバー',
    'header.research': '研究',
    'header.themes': '研究テーマ',
    'header.areas': '研究分野',
    'header.publications': '研究業績',
    'header.projects': 'プロジェクト',
    'header.resources': 'リソース',
    'header.activities': '活動',
    'header.gallery': 'ギャラリー',
    'header.contact': 'お問い合わせ',
    'header.admin': '管理',
    'header.menu': 'メニュー',
    'header.adminLogin': '管理者ログイン',

    // Hero
    'hero.slide1.title': '持続可能な未来への革新',
    'hero.slide1.subtitle': '研究、教育、そして地域活動',
    'hero.slide2.title': '環境課題への理解',
    'hero.slide2.subtitle': '気候変動と生物多様性の損失に取り組む',
    'hero.slide3.title': '地域主導の解決策',
    'hero.slide3.subtitle': '地域の声を世界的なインパクトへ',
    'hero.learnMore': '詳しく見る',

    // About
    'about.title': '研究室について',
    'about.description': 'シン研究室は、神戸市外国語大学の学際的な研究グループです。応用研究、教育、地域連携を通じて、環境課題の理解と解決に取り組んでいます。',
    'about.vision.title': 'ビジョン',
    'about.vision.text': '研究、教育、地域活動を統合し、環境リスクを低減し、環境的・社会的福祉を向上させること。',
    'about.mission.title': 'ミッション',
    'about.mission.text': '政策に関連する質の高い研究を生み出し、学生にフィールドワークの手法を指導し、持続可能性への取り組みに地域社会を巻き込むこと。',
    'about.approach.title': 'アプローチ',
    'about.approach.text': '現実の文脈に基づいた混合研究法を用い、学術界を超えたインパクトを重視し、環境・社会・経済の側面を結びつけます。',

    // Themes
    'themes.title': '研究テーマ',
    'themes.subtitle': '私たちの学際的な研究は、環境持続可能性の複数の重要分野に及んでいます。',
    'themes.plastics': 'プラスチック',
    'themes.waste': '廃棄物管理',
    'themes.climate': '気候変動',
    'themes.energy': '再生可能エネルギーと技術',
    'themes.urban': '社会・都市システム',
    'themes.others': 'その他',

    // Team
    'team.title': 'メンバー紹介',
    'team.subtitle': '環境持続可能性に取り組む多様な研究者と学生のグループです。',
    'team.pi': '研究代表者',
    'team.researcher': '主任研究員',
    'team.students': '学生研究グループ',
    'team.undergrad': '学部生チーム',
    'team.bio1': '神戸市外国語大学教授。環境政策と持続可能性の専門家。',
    'team.bio2': '海洋プラスチックと地域連携戦略を専門としています。',
    'team.bio3': 'フィールドワークや地域プロジェクトに熱心に取り組む学生たち。',

    // Publications
    'publications.title': '研究業績',
    'publications.pub1': '日本における海洋プラスチック汚染に対する地域社会の認識',
    'publications.pub2': '都市部における効果的な廃棄物管理への障壁',
    'publications.pub3': '持続可能な開発のための教育：ケーススタディ',

    // Activities
    'activities.title': '最近の活動',

    // Collaborators
    'collaborators.title': '共同研究機関',

    // Contact
    'contact.title': 'お問い合わせ',
    'contact.subtitle': '研究協力、学生の機会、または地域パートナーシップについては、メールまたはお問い合わせフォームからご連絡ください。',
    'contact.location': '所在地',
    'contact.locationValue': '神戸市外国語大学（兵庫県神戸市）',
    'contact.email': 'メール',
    'contact.form.name': 'お名前',
    'contact.form.email': 'メールアドレス',
    'contact.form.subject': '件名',
    'contact.form.message': 'メッセージ',
    'contact.form.send': '送信する',
    'contact.form.namePlaceholder': 'お名前を入力してください',
    'contact.form.emailPlaceholder': 'メールアドレスを入力してください',
    'contact.form.subjectPlaceholder': 'お問い合わせ内容の件名',
    'contact.form.messagePlaceholder': 'メッセージを入力してください...',

    // Footer
    'footer.tagline': '持続可能な未来のための研究、教育、そして地域活動。科学と社会の架け橋に。',
    'footer.quickLinks': 'クイックリンク',
    'footer.contactUs': 'お問い合わせ',
    'footer.findUs': 'アクセス',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.rights': 'All rights reserved.',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
