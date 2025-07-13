export interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionsResponse {
  total: {
    [year: string]: number;
  };
  contributions: GitHubContribution[];
}

export interface GitHubHeatmapProps {
  username: string;
  year?: number;
  className?: string;
}
