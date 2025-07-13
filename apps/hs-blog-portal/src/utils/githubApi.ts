import { GitHubContributionsResponse } from '@/types/github';

export async function fetchGitHubContributions(
  username: string,
  year?: number
): Promise<GitHubContributionsResponse> {
  const yearParam = year ? `?y=${year}` : '';
  const url = `https://github-contributions-api.jogruber.de/v4/${username}${yearParam}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub contributions: ${response.status}`);
    }
    
    const data: GitHubContributionsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    throw error;
  }
}
