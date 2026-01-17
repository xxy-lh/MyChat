import { User, Chat, Group, MediaItem } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Alex Morgan',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUJOJFp_ubsluPd5b497LoFh5GK8eZgdHJLtaJf5qV3z-XZOuV5DtK2Ipw2J5uCRCQuaJ-VDjkHtATbDl3AQHBnkhLis94edeU5SMGhK-UUEtB7LxCnzGIQM4M3TgAkbf6SULuurFFSyfFGY7rjNqiDIk0dBRCsPOmMz350HzVxG7wnaKxEE5a350UxUKzW_Nqz1HdswE6BUD02pimEwtks7pfbcOiHVz0rsY8Dya_aHHVrFlX85sgY8tqcKzNjhjhpaW4yHGnkwI',
  status: 'online',
  handle: '@alex_m',
  location: '中国，上海',
  phone: '+86 138 0000 1234',
  bio: '产品设计师 & 艺术总监。咖啡爱好者 & 像素艺术家。'
};

export const CONTACTS: User[] = [
  { id: '1', name: 'Alice Moore', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQfHO5d5VyQuv6fE4-OP0Wc-UmUZAdXMXZ92-9M8-_Njl164AJEuez2p84RzSLF8xnHCEi6qgt5nCPI3RSr-Ptp18UWkxFswGjgvhxtJBqvNDSgDw1ORLxrNzveHAU54DReUoQx_8a_C1YuqFp5J_6hNDLGQEyfTUyySYNK9HCLTf1bzQtv1pWzTPnxnLOype1SLZMSicR4chAC-cow1uDCWBi6g6N237RQhQ8f1RHndiVYlyU3zAzBarJMfB9L83wDI0zpTUQxBo', status: 'online', bio: '生活不止眼前的苟且' },
  { id: '2', name: 'David Chen', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf5ICbI52vmYqQYy07CpDIAvGVpHlgGAirSqryXTViZH3M_afCvfEZAbbRUPSuyTpVnX5u6Ks3hbygYWC9Ygzgifo0o90TS9_UfbMYcSP6IHsXCK0gaa70KkaDaEdPDAvSuDPv3FOM6f5y2L23mPpOmI84WU-SKpolyAkHPMYiNaVuHJkeRMzC6ZadGtb8D1MDE9cBMDPXw2AztZznUFSxdZU8Y-RKO0FokDgTnWLsZ6lQINC0BQys6PINOLUDp7yGgyzH2DpFx3s', status: 'away', lastSeen: '5分钟前', bio: '全栈工程师' },
  { id: '3', name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7byb66vw--KGYnsmUs0tSAjAm0EuC0ujD-TsP4_ehJsoFu93eWzUXz7BG6tNDpTxb599szqRkvauE3oqNxGjw8waHfKb1iTPph-pwVWl5k1C7IiZKLA1GGoO8U6GvnuHdm3XiJ5AFLjZMgxezvVcItnh6aqy5GBZk5SKP68_CeE0DyNAJyOukl2_qabSybXmgpXtUjBFJu6P1htquTVSC73KBr-3JG9IKd2nXGIBkWjOItcVgS5GxgX-Uve1IJlx1wY40f3_Qsrg', status: 'online', bio: '摄影师 | 旅行' },
  { id: '4', name: 'Michael Ross', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6X4msGqMEYiLVD-NRIQr2dxJ9aCqmN0BoaIcJd20WB4y1_O3p_IPNmtF2SPdtsz38HMCoee_J_7fWc8_rnOiyU6OHKktGAK2IwiiKLlVD4u0WC_1r9N6Oq1ViP1xzaHOxrY8uNPxrPz5KKM5wxy8CyDQKn4XvP2UUicCf3xs2yK8gCpd_QJ6DXCRoRNbGDtd-91syQLABDJtSMCTA3bRCe4JwBhU3ofkNINfFr3EgqYpAY0--XzBccK4joHSkl5ib6CTC_4rxvVs', status: 'offline', lastSeen: '2小时前', bio: '忙碌中...' },
];

export const CHATS: Chat[] = [
  { id: '1', userId: '1', lastMessage: '设计文件我马上发给你。', lastMessageTime: '上午 10:42', unreadCount: 2 },
  { id: '2', userId: 'group1', isGroup: true, groupName: '设计团队', lastMessage: 'Bob: 能帮忙看看这个吗？', lastMessageTime: '昨天', unreadCount: 0 },
  { id: '3', userId: '3', lastMessage: '听起来不错，到时候见。', lastMessageTime: '周二', unreadCount: 0 },
  { id: '4', userId: 'group2', isGroup: true, groupName: '市场营销频道', lastMessage: '新活动素材上线了！', lastMessageTime: '周一', unreadCount: 5 },
  { id: '5', userId: '2', lastMessage: '收到了，谢谢！', lastMessageTime: '上周', unreadCount: 0 },
];

export const GROUPS: Group[] = [
  { id: '1', name: '科技前沿', subscribers: '15万', description: '每日更新最新数码产品、软件评测和硅谷新闻。加入讨论。', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVu0GZ2RJFpaUbufelXo3fZA0DGsYvv25b-HxhOeO1pCW9QuEZICSV2DpHq0babHpX-InLT2gnfUrh8nhs3HK3ZlTsPHedz3Fqo74C2H5MiJv-FDqJjG1_PFvpHHaRnF2vaiGJO0iCuNvqdAPdZxQkI-W1hl02rwtfCFfGUomaiyfYhqdHRFxpib3w6SOBZslnltL0GuvubNP9TgstJqWWVGwwkhnDF_awwjy9dWXZhc3eKo-8FsRZTxvbRpclUbtCCTh4q7o90u0', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5A1eBqUCckJ3XKDW_wnPC8IB46fN0TlE7Khr2PfT9Hidv1rpMRZwf2TdghC_4U4e4lC-1YZkzxo1ojndM7Jxs_QFyRiGlSExIZH57ZFULU4gGZXjktq-BlQ4Aju0cLaBjdJ6-KNZBxhF7PmoUZzJ8pHZhGyITPofnpnXJ7th3Dw44TPasp9YJgPdFc-rCGqWF5EIfggWqyAs5nLYZ2yEJJ3b2xMZT8sqqsivBFCiFv9NufUftf-bmE4zXd37_i1Y1DN4mFBFEpVk' },
  { id: '2', name: '全球新闻', subscribers: '4万', description: '来自世界各地的突发新闻更新。政治、经济和环境。', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz5wo-yCDqz3R1W5lN6WsZlYa_wSbDnuBxNXnIKs0HFGXTvDLXAcUJBKgBoypc8AxVSYqRJhG8EFzxW57Sdy-LhRCtzyoZCXaQEu1KBv9hLMemnVCNfCdgestmHPyEXKJHvjXuO0m-bkVt5xZ_3OBmC6CO0g2VU9z7FLN27SzaA-wq6pvJim5cet3X7EfhWy_Y7xKF9yxuA038q9Oxsi2J0-kUMXnN9_dO3_b2E8onJa3nT_rbEQR5xsYSA0slxocpQXfL_K_Ol60', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmL2mHcPblRSk_BGlYDuaiWHg6bkKvio4oeEGpN-tlfHBYnFsj3VOGP6ge1O2OSkTl_BeaQZG2P2gkjTpT-Zjs_8qXVgrn6kp2RXa0v5sZu7zketu5OP9deNB1XcunmXl9EB135gVy_Aep7KySG0A7U15UugTi0ZTHPxHnu4IZJkVk2wsS0D1dA6HIiCCArObdue6bg4T6_HM_gHurXE77HWO2yLZYiFUoVZ0uKjH5alwlpL0he_uo_53R1AS_GnLg7O-sQ8ENKRA' },
  { id: '3', name: '设计中心', subscribers: '8.5万', description: '为数字创作者提供每日UI/UX灵感、资源和社区反馈。', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3KEvVqGsr-UhNk4rFRGFzscO8FhT07nmfOsKxdwaYD3cjhf9lH29vGOAFgOoiFg-LtoCYbg0QeFhI-YU7Fy-VCEou6VGwy4SD6kqmSK5VjRXqJe5HKTbTLQ33pkoqkD646w8yM7dJcRuCPS3UUkjRywSHqOvcsoDtjLZD8r13a2zD5nSXmMEIrUkz8PYq2bnqJpZT4aCOd_h-IbbUHOJEbHNWIcTB1cCWWszhy605R4ngON_x2Pnlx8hIjuSM0MDQceWuTqU-V0E', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApklnnAeioZmiIrVsZ2bPSqH1eb6RenPKYZ0RwfOSEr8yHOHPVfIHdULe2k617gGeQ2dwTQWX7SsQXZCaAeYyIrrXsvLxDb7c5RU1g45aabZYPgLNFtp76LITRBnKyTKXo-K5x-JNf9gbndqpU-dBwkndzev8o9ip2CGst90TeDue3v-yyQLaUkf1b-9nl5DrtBi21uuLgwqNA9f6hiVTagbvM7eoL5qqoitivVcfvYo8ugUBBstULdvemtlqs3e3auQgfyP5UXnI' },
];

export const MEDIA_ITEMS: MediaItem[] = [
  { id: '1', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj2cZDqQrDIcjt8LMqaBavKFH_dzgunrdiIeOu7TzxClzhJ6wkWpEE-BNDx4vbV1VWxFEQLsv_4w37c8i6TPccKkjmgd8EONt9CaBpbykQAi95SC3BNK7aY0wBROe5ItEoFVcEhQrYXgg4sysJM_YF75mvWx1uCZEuwmq7t92NXvj_QDKWuOHPDJ6HVNXqdJX5LP_ZNrgKzopEEBaNxZmNjSAlnrpvoff5HahoCrnHNpo-YgvYDT4tbSmtNSsImzVFZFzpxFQbOjM', date: '10月24日 10:42' },
  { id: '2', type: 'video', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsYUgNj-d26ZVrCCzL1h3EGJ5_qM4DezCdFiZU5N77K_O7WGxEY4_nkSrLYMZcA_KlwctwzxWz8CAFz-7jQ7e_qBe1CQzhnWZrlmzAlmnzgzuXIjaeuLUEFA87WpJZIJN12hMhmgp9JGFpSMjBYh7TRvLE9GJXjS5_zexrjA7kXuyFrwqrybtIbTEFe1MsjVgLfxg5ojOBvmv1SijgnCC5T7mdajlvnrBdgYuAyXSAKNtlHb7GzxeCeAM6xhNbeNQxzW_3rJzeWqU', date: '10月22日 16:15', duration: '0:42' },
  { id: '3', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzK79TNuMQaFc6jxVy2-7OPsntBwANXQXynMA02VQ4XBwOfPesV3hiK_H54-ktnqU7X_diJKphi1oKmxFG3wODkyVAialeTFUeBYw91xNAetnMBEYxh6zXl68UfB-JD8_Pz1wqEY1EHeF4Hcvdv2-nbGP0yhTP3MtO_MFRR0mCzZtvqrosteLPQJDx4RKjFgUUHW9gdq0YmoWtmL5PR2NuWybeDFtTfwXpk0nvaN5GUtajyyimAVecS_CnNbGv7WOhievH1o2T3zo', date: '10月20日 11:20' },
  { id: '4', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTikF560dMiuvCs-QWv0wcDVAWPrWUcQS2LdiVV7V2m5aAc6rjIlZKRhtjPo3SHAEorQKIBwlBgIvD8MgWLAscVSN5oJkDNIgj4dNx8u42WCrwiDYUjdr0HbRpqdEaVW69eVbrs3VQfBYlCgF7Ewkd6k8hMHLMxaxwlqDYLtNWBlYc525qPwp0Oi_6DBoYbgC9ocJ1tyBFsxKf3s477NvQG_YkhqIwQIFk2u3mS9aevqjT3DpLCWJm051Oj9QqhuzPyn7meRutmPc', date: '10月18日 09:00' },
  { id: '5', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB42nAllsUKULtOrqdxdgfASxD5KAGAf0xqk5NLzjHhR2trxY7fbEyZ0eE0HbhDgKBVv7GJY5erH2cp3_on7O18emtHSyrotRnL-jz4SuPOcSYGULbBfq0F2GvV-Dtjg0hpGmQJHXYAa5sC9XtoEvBM_ksgh5fP-NnOzvDp10_aW-CFa7rBZMncvROJ40lfaFrdhUQ69ecEHHmqK9K4Kog3bv61vdsmqFij57Rhp6L0Ys4cMvT4EYuENdhU9qg6gr0lBGU0vPP2cUw', date: '10月15日 14:30' },
  { id: '6', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz4vsM8Ovx4UfPWIRjYj8OfOIdWtAJF-d9KVfLj8JRW3hF2B4Hv31LfMcS7cPPto1KPZDHqdSa0KtT2nWs85l75m0HiCbaPU6h-Lo4R20fDj46NSvTmnsBiQHSuGn9bCQW5ek7sSCzlTrPVI-bUvMS5i-fLZpFjKi-jxLCyrHwOuhH8zAf8QytMUC-7N8Iu1_VjfgFqBF4g23rDlFfMY8UJYQ61nkz4LLG1oJdGwgooGdVw0yt6FJiCEtHqlN5eJLx2QnqRtkuQPE', date: '10月12日 13:15' },
];