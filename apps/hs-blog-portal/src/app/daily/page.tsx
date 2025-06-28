'use client'

import Image from 'next/image'
import { IoLogoGithub } from 'react-icons/io5'
import { SiDuolingo } from 'react-icons/si'
import { useDailyTranslation } from '@/hooks/useTranslation'

export default function Daily() {
  
  const t = useDailyTranslation()
  
  /** 生活随笔 */
  const notes = [
    { date: '2024-11-10', text: '降温了，把冬天的厚被子拿出来晒，晚上睡觉闻到阳光的味道。' }, 
    { date: '2024-10-20', text: '南京的秋天真美，金陵的银杏大道铺满金黄，走在路上心情格外舒畅。' },
    { date: '2024-10-05', text: '国庆假期去了南京夫子庙，人山人海，但秦淮河的夜景依然让人流连忘返。' },
    { date: '2024-09-15', text: '窗外下着雨，在家敲代码，听着雨声，感觉格外专注和惬意 ~~' },
    { date: '2023-12-15', text: '凌晨3点，代码和咖啡是最好的搭配' },
  ];

  /** 按日期排序 */
  const sortedNotes = notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  /** 坚持事项 */
  const persistentActivities = [
    {
      id: 'github',
      name: 'GitHub',
      icon: <IoLogoGithub size={24} className="text-gray text-text"/>,
      color: 'bg-gray-500'
    },
    {
      id: 'duolingo',
      name: 'Duolingo',
      icon: <SiDuolingo size={24} className="text-green-500" />,
      color: 'bg-green-500'
    },
  ]

  return (
    <div className="flex flex-col lg:p-[50px_200px] lt-lg:p-[50px_40px]">

      <section
        className="mb-12 opacity-0 animate-fade-in-up"
        style={{animationDelay: '0.3s'}}
      >
        <div className="font-mono text-sm text-primary mb-3">$ github stats</div>
          <div className="overflow-x-auto">
            <div className="min-w-[640px] md:w-full">
              <Image
                src="https://ghchart.rshah.org/1E80FF/huoshan25"
                alt="GitHub Contribution Graph"
                width={800}
                height={128}
                priority
              />
            </div>
        </div>
      </section>

      <section
        className="mb-12 opacity-0 animate-fade-in-up"
        style={{animationDelay: '0.4s'}}
      >
        <div className="font-mono text-sm text-primary mb-3">$ {t.persistentActivities}</div>
        <div className="flex flex-wrap gap-4">
          {persistentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 bg-base p-3 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-10 h-10 relative flex-shrink-0 rounded-full flex items-center justify-center">
                <div className={`absolute inset-0 ${activity.color} rounded-full opacity-10`}></div>
                <div className="flex items-center justify-center">
                  {activity.icon}
                </div>
              </div>
              <div>
                <div className="font-medium text-text">{activity.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        className="mb-12 font-mono text-sm text-text text-center opacity-0 animate-fade-in-up"
        style={{animationDelay: '0.5s'}}
      >
        {t.motto}
      </div>

      <section
        className="opacity-0 animate-fade-in-up"
        style={{animationDelay: '0.6s'}}
      >
        <div className="font-mono text-sm text-primary mb-3">$ {t.notes}</div>
        <div className="space-y-2">
          {sortedNotes.map((note, index) => (
            <div
              key={index}
              className="bg-base p-3 rounded-lg flex items-center gap-3"
            >
              <div className="text-xs text-text font-mono whitespace-nowrap">{note.date}</div>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="text-sm text-text">{note.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}