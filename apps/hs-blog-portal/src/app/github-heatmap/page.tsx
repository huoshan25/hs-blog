'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GitHubHeatmap from '@/components/GitHubHeatmap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function GitHubHeatmapPage() {
  const [username, setUsername] = useState('huoshan25');
  const [year, setYear] = useState(new Date().getFullYear());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <motion.div
        className="max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            GitHub Contributions Heatmap
          </h1>
          <p className="text-muted-foreground text-lg">
            Visualize your coding journey with an interactive contribution heatmap
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="mb-8 backdrop-blur-sm bg-card/95 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Configuration</CardTitle>
              <CardDescription>
                Customize the heatmap by entering a GitHub username and selecting a year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <label htmlFor="username" className="text-sm font-medium text-foreground mb-2">
                    GitHub Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={cn(
                      "px-3 py-2 border border-input rounded-md shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
                      "bg-background text-foreground placeholder:text-muted-foreground",
                      "transition-colors duration-200"
                    )}
                    placeholder="Enter GitHub username"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="year" className="text-sm font-medium text-foreground mb-2">
                    Year
                  </label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className={cn(
                      "px-3 py-2 border border-input rounded-md shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
                      "bg-background text-foreground",
                      "transition-colors duration-200"
                    )}
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GitHubHeatmap
            username={username}
            year={year}
            className="w-full mb-8"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-sm bg-card/95 border-border/50">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  This heatmap shows GitHub contribution activity for the specified user and year.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Data is fetched from the GitHub Contributions API in real-time.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Hover over any square to see detailed contribution information for that day.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
