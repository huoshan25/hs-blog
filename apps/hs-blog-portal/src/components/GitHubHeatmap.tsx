'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubContribution, GitHubHeatmapProps } from '@/types/github';
import { fetchGitHubContributions } from '@/utils/githubApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  EnhancedTooltip as Tooltip,
  EnhancedTooltipContent as TooltipContent,
  EnhancedTooltipProvider as TooltipProvider,
  EnhancedTooltipTrigger as TooltipTrigger
} from '@/components/ui/enhanced-tooltip';
import { cn } from '@/lib/utils';

const GitHubHeatmap: React.FC<GitHubHeatmapProps> = ({ 
  username, 
  year = new Date().getFullYear(),
  className = '' 
}) => {
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContributions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGitHubContributions(username, year);
        setContributions(data.contributions);
        setTotalContributions(data.total[year.toString()] || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contributions');
      } finally {
        setLoading(false);
      }
    };

    loadContributions();
  }, [username, year]);

  const getLevelColor = (level: number): string => {
    const colors = {
      0: 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50',
      1: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 shadow-emerald-100/50',
      2: 'bg-emerald-300 dark:bg-emerald-700/60 border-emerald-400 dark:border-emerald-600 shadow-emerald-200/50',
      3: 'bg-emerald-500 dark:bg-emerald-600/80 border-emerald-600 dark:border-emerald-500 shadow-emerald-300/50',
      4: 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-400 shadow-emerald-400/50'
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  const getLevelGlow = (level: number): string => {
    if (level === 0) return '';
    const glows = {
      1: 'shadow-sm shadow-emerald-200/30 dark:shadow-emerald-900/30',
      2: 'shadow-md shadow-emerald-300/40 dark:shadow-emerald-700/40',
      3: 'shadow-lg shadow-emerald-400/50 dark:shadow-emerald-600/50',
      4: 'shadow-xl shadow-emerald-500/60 dark:shadow-emerald-500/60'
    };
    return glows[level as keyof typeof glows] || '';
  };

  const getTooltipText = (contribution: GitHubContribution) => {
    const date = new Date(contribution.date);
    const formattedDate = date.toISOString().split('T')[0]; // 格式: 2025-07-01
    const countText = contribution.count === 1 ? 'contribution' : 'contributions';
    return {
      date: formattedDate,
      count: contribution.count,
      countText: `${contribution.count} ${countText}`,
      level: contribution.level
    };
  };

  const getNoContributionText = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; // 格式: 2025-07-01
    return {
      date: formattedDate,
      count: 0,
      countText: 'No contributions',
      level: 0
    };
  };

  const getWeeksInYear = (year: number): Date[][] => {
    const weeks: Date[][] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Find the first Sunday of the year or the start of the year
    const firstDay = new Date(startDate);
    const dayOfWeek = firstDay.getDay();
    if (dayOfWeek !== 0) {
      firstDay.setDate(firstDay.getDate() - dayOfWeek);
    }

    let currentDate = new Date(firstDay);

    // Generate exactly 53 weeks to match GitHub's layout
    for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
      const week: Date[] = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const getContributionForDate = (date: Date): GitHubContribution | null => {
    const dateString = date.toISOString().split('T')[0];
    return contributions.find(c => c.date === dateString) || null;
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: 'repeat(53, 12px)', gridTemplateRows: 'repeat(7, 12px)' }}>
              {Array.from({ length: 371 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-muted rounded-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.001, duration: 0.2 }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="pt-6">
          <motion.div
            className="text-destructive text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-medium">Error loading GitHub contributions</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const weeks = getWeeksInYear(year);

  return (
    <TooltipProvider>
      <Card className={cn("w-full backdrop-blur-sm bg-card/95 border-border/50", className)}>
        <CardHeader className="pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              GitHub Contributions
            </CardTitle>
            <CardDescription className="text-base">
              <motion.span
                key={totalContributions}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="font-semibold text-foreground"
              >
                {totalContributions.toLocaleString()}
              </motion.span>
              {' '}contributions in {year}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="pb-6">
      
          <div className="relative overflow-x-auto">
            {/* Month labels */}
            <motion.div
              className="flex mb-3 ml-8"
              style={{ width: '636px' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {monthLabels.map((month, index) => (
                <motion.div
                  key={month}
                  className="text-xs font-medium text-muted-foreground text-left"
                  style={{ width: '53px' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {month}
                </motion.div>
              ))}
            </motion.div>

            <div className="flex">
              {/* Day labels */}
              <motion.div
                className="flex flex-col mr-3 justify-between"
                style={{ height: '98px' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {['Mon', 'Wed', 'Fri'].map((day, index) => (
                  <motion.div
                    key={day}
                    className="text-xs font-medium text-muted-foreground h-3 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {day}
                  </motion.div>
                ))}
              </motion.div>

              {/* Heatmap grid */}
              <motion.div
                className="grid gap-1.5 p-2 rounded-lg bg-gradient-to-br from-background/50 to-muted/30"
                style={{
                  gridTemplateColumns: 'repeat(53, 12px)',
                  gridTemplateRows: 'repeat(7, 12px)',
                  width: '636px',
                  height: '84px'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AnimatePresence>
                  {weeks.map((week, weekIndex) =>
                    week.map((date, dayIndex) => {
                      const contribution = getContributionForDate(date);
                      const isCurrentYear = date.getFullYear() === year;
                      const cellIndex = weekIndex * 7 + dayIndex;

                      if (!isCurrentYear) {
                        return (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className="w-3 h-3"
                            style={{
                              gridColumn: weekIndex + 1,
                              gridRow: dayIndex + 1
                            }}
                          />
                        );
                      }

                      return (
                        <Tooltip key={`${weekIndex}-${dayIndex}`}>
                          <TooltipTrigger asChild>
                            <motion.div
                              className={cn(
                                "w-3 h-3 rounded-sm cursor-pointer border transition-all duration-200",
                                "hover:scale-125 hover:z-10 relative",
                                contribution ? getLevelColor(contribution.level) : getLevelColor(0),
                                contribution && contribution.level > 0 ? getLevelGlow(contribution.level) : ""
                              )}
                              style={{
                                gridColumn: weekIndex + 1,
                                gridRow: dayIndex + 1
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: 0.5 + cellIndex * 0.002,
                                duration: 0.2,
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                              }}
                              whileHover={{
                                scale: 1.3,
                                zIndex: 10,
                                transition: { duration: 0.1 }
                              }}
                              transition={{
                                duration: 0.2,
                                ease: "easeOut"
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="border-border/50 shadow-lg bg-popover/95 backdrop-blur-sm px-3 py-2"
                            showArrow={false}
                          >
                            {(() => {
                              const tooltipData = contribution
                                ? getTooltipText(contribution)
                                : getNoContributionText(date);

                              return (
                                <div className="text-xs font-medium text-foreground whitespace-nowrap">
                                  {tooltipData.date}: {tooltipData.count} {tooltipData.count === 1 ? 'contribution' : 'contributions'}
                                </div>
                              );
                            })()}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Legend */}
            <motion.div
              className="flex items-center justify-between mt-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <span className="text-xs font-medium text-muted-foreground">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level, index) => (
                  <motion.div
                    key={level}
                    className={cn(
                      "w-3 h-3 rounded-sm border transition-all duration-200",
                      getLevelColor(level),
                      level > 0 ? "hover:scale-110" : ""
                    )}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.2 }}
                    whileHover={level > 0 ? { scale: 1.2 } : {}}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">More</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default GitHubHeatmap;
