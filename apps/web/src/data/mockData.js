
export const categoriesHierarchy = [
  { id: 'ai-insight', name: 'AI Insight', children: [] },
  { 
    id: 'crypto-alpha', 
    name: 'Crypto Alpha', 
    children: [
      { id: 'genesis-series', name: 'The Genesis Series' }
    ]
  },
  { id: 'agents-harness-lab', name: 'Agents Harness Lab', children: [] }
];

export const fallbackAiTrends = [
  'Multi-modal Agents', 
  'Autonomous Workflows', 
  'Reasoning Models'
];

export const blogPosts = [
  {
    id: 'post-1',
    title: 'The Birth of Bitcoin',
    date: '2025.01.15',
    category: 'Crypto Alpha',
    subCategory: 'The Genesis Series',
    excerpt: 'An exploration of the original whitepaper and the cryptographic breakthroughs that made decentralized consensus possible. We trace the origins of peer-to-peer electronic cash.',
    thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800',
    author: 'Maya Chen',
    type: 'article'
  },
  {
    id: 'post-2',
    title: 'What is DeFi?',
    date: '2025.01.10',
    category: 'Crypto Alpha',
    subCategory: 'The Genesis Series',
    excerpt: 'Deconstructing decentralized finance. How automated market makers, liquidity pools, and smart contracts are rebuilding traditional financial primitives on-chain.',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    author: 'Raj Patel',
    type: 'article'
  },
  {
    id: 'post-3',
    title: 'Web3 Fundamentals',
    date: '2025.01.05',
    category: 'Crypto Alpha',
    subCategory: 'The Genesis Series',
    excerpt: 'Beyond the buzzwords: understanding the transition from read-write to read-write-own. A foundational guide to the mechanics of the decentralized web.',
    thumbnail: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?auto=format&fit=crop&q=80&w=800',
    author: 'Lucia Torres',
    type: 'article'
  },
  {
    id: 'log-1',
    title: 'V1.0.4: Autonomous Agent Memory Tuning',
    date: '2025.02.01',
    category: 'Agents Harness Lab',
    subCategory: null,
    excerpt: 'Build-in-Public Project Log: Reduced context window latency by 40% using vector clustering. Initial deployment of the autonomous trading agent shows promising execution speeds but requires tighter risk parameters.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800',
    author: 'Dev Team',
    type: 'project-log'
  },
  {
    id: 'log-2',
    title: 'Integration: Multi-Chain Oracle Feeds',
    date: '2025.01.28',
    category: 'Agents Harness Lab',
    subCategory: null,
    excerpt: 'Build-in-Public Project Log: Successfully wired up the agent to digest real-time decentralized oracle networks. Encountered edge cases with asynchronous block times across chains.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    author: 'Dev Team',
    type: 'project-log'
  }
];

export const dashboardMetrics = {
  currentPrice: {
    value: 2847.32,
    change24h: 3.24,
    currency: 'USD'
  },
  compositeFairValue: {
    value: 3421.89,
    confidence: 87.3,
    range: { min: 2890.12, max: 4123.67 }
  },
  opportunity: {
    percentage: 20.18,
    status: 'undervalued',
    label: 'Undervalued'
  }
};
