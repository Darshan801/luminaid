// Partner organization logos
// Using data URIs for placeholder logos to avoid external requests

const createPlaceholderSVG = (text) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="50" viewBox="0 0 120 50">
      <rect width="120" height="50" fill="#f5f5f5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">${text}</text>
    </svg>
  `)}`
}

export const partners = [
  {
    name: 'Red Cross',
    logo: createPlaceholderSVG('Red Cross')
  },
  {
    name: 'UNICEF',
    logo: createPlaceholderSVG('UNICEF')
  },
  {
    name: 'Direct Relief',
    logo: createPlaceholderSVG('Direct Relief')
  },
  {
    name: 'ShelterBox',
    logo: createPlaceholderSVG('ShelterBox')
  },
  {
    name: 'World Vision',
    logo: createPlaceholderSVG('World Vision')
  }
];
