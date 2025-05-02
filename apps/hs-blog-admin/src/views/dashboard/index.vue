<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import {
  getArticleCategory,
  getArticleOverview,
  getArticleTimeDistribution,
  getArticleTrend,
  getArticleWords,
  getTagStats,
  getTagTrend,
} from '@/api/instrumentPanel'
import 'echarts-wordcloud'

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  Object.values(charts).forEach((chart) => {
    chart?.dispose()
  })
})

/*引用DOM元素*/
const articleTrendRef = ref<HTMLElement | null>(null)
const categoryPieRef = ref<HTMLElement | null>(null)
const timeDistributionRef = ref<HTMLElement | null>(null)
const wordsDistributionRef = ref<HTMLElement | null>(null)
const tagCloudRef = ref<HTMLElement | null>(null)
const tagTrendRef = ref<HTMLElement | null>(null)

/*图表实例*/
let charts: { [key: string]: echarts.ECharts } = {}

/*数据概览*/
const overviewData = ref([
  { label: '文章总数', value: 0, desc: '所有文章数量', loading: true },
  { label: '已发布', value: 0, desc: '已发布的文章数量', loading: true },
  { label: '草稿箱', value: 0, desc: '草稿状态的文章数量', loading: true },
  { label: '标签总数', value: 0, desc: '所有标签数量', loading: true },
])

// 加载状态
const chartLoading = reactive({
  articleTrend: true,
  categoryPie: true,
  timeDistribution: true,
  wordsDistribution: true,
  tagCloud: true,
  tagTrend: true,
})

/*初始化图表*/
const initCharts = () => {
  if (articleTrendRef.value) {
    charts.articleTrend = echarts.init(articleTrendRef.value)
    charts.articleTrend.showLoading()
  }
  if (categoryPieRef.value) {
    charts.categoryPie = echarts.init(categoryPieRef.value)
    charts.categoryPie.showLoading()
  }
  if (timeDistributionRef.value) {
    charts.timeDistribution = echarts.init(timeDistributionRef.value)
    charts.timeDistribution.showLoading()
  }
  if (wordsDistributionRef.value) {
    charts.wordsDistribution = echarts.init(wordsDistributionRef.value)
    charts.wordsDistribution.showLoading()
  }
  if (tagCloudRef.value) {
    charts.tagCloud = echarts.init(tagCloudRef.value)
    charts.tagCloud.showLoading()
  }
  if (tagTrendRef.value) {
    charts.tagTrend = echarts.init(tagTrendRef.value)
    charts.tagTrend.showLoading()
  }
}

/**设置文章趋势图表*/
const setArticleTrendChart = (data: any) => {
  const trendOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: data.xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.series,
        type: 'line',
        smooth: true,
      },
    ],
  }
  charts.articleTrend?.hideLoading()
  charts.articleTrend?.setOption(trendOption)
  chartLoading.articleTrend = false
}

/**设置文章分类图表*/
const setCategoryPieChart = (data: any) => {
  const categoryOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: data,
      },
    ],
  }
  charts.categoryPie?.hideLoading()
  charts.categoryPie?.setOption(categoryOption)
  chartLoading.categoryPie = false
}

/**设置发布时间分布图表*/
const setTimeDistributionChart = (data: any) => {
  const timeOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: data.xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.series,
        type: 'bar',
      },
    ],
  }
  charts.timeDistribution?.hideLoading()
  charts.timeDistribution?.setOption(timeOption)
  chartLoading.timeDistribution = false
}

/**设置文章字数分布图表*/
const setWordsDistributionChart = (data: any) => {
  const wordsOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: data,
      },
    ],
  }
  charts.wordsDistribution?.hideLoading()
  charts.wordsDistribution?.setOption(wordsOption)
  chartLoading.wordsDistribution = false
}

/**设置标签云图表*/
const setTagCloudChart = (data: any) => {
  const tagCloudOption = {
    tooltip: {
      show: true,
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        right: null,
        bottom: null,
        sizeRange: [12, 36],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            return (
              'rgb(' +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(',') +
              ')'
            )
          },
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333',
          },
        },
        data: data.map((item: any) => ({
          name: item.name,
          value: item.value,
        })),
      },
    ],
  }
  charts.tagCloud?.hideLoading()
  charts.tagCloud?.setOption(tagCloudOption)
  chartLoading.tagCloud = false
}

/**设置标签趋势图表*/
const setTagTrendChart = (data: any) => {
  const tagTrendOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: data.xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.series,
        type: 'line',
        smooth: true,
      },
    ],
  }
  charts.tagTrend?.hideLoading()
  charts.tagTrend?.setOption(tagTrendOption)
  chartLoading.tagTrend = false
}

/*加载数据*/
const loadData = async () => {
  initCharts()
  Promise.all([
    getArticleOverview().catch((error) => {
      console.error('加载概览数据失败:', error)
      return { data: { total: 0, published: 0, draft: 0, tags: 0 } }
    }),
    getArticleTrend().catch((error) => {
      console.error('加载文章趋势数据失败:', error)
      chartLoading.articleTrend = false
      charts.articleTrend?.hideLoading()
      return { data: { xAxis: [], series: [] } }
    }),
    getArticleCategory().catch((error) => {
      console.error('加载文章分类数据失败:', error)
      chartLoading.categoryPie = false
      charts.categoryPie?.hideLoading()
      return { data: [] }
    }),
    getArticleTimeDistribution().catch((error) => {
      console.error('加载发布时间分布数据失败:', error)
      chartLoading.timeDistribution = false
      charts.timeDistribution?.hideLoading()
      return { data: { xAxis: [], series: [] } }
    }),
    getArticleWords().catch((error) => {
      console.error('加载文章字数分布数据失败:', error)
      chartLoading.wordsDistribution = false
      charts.wordsDistribution?.hideLoading()
      return { data: [] }
    }),
    getTagStats().catch((error) => {
      console.error('加载标签统计数据失败:', error)
      chartLoading.tagCloud = false
      charts.tagCloud?.hideLoading()
      return { data: [] }
    }),
    getTagTrend().catch((error) => {
      console.error('加载标签趋势数据失败:', error)
      chartLoading.tagTrend = false
      charts.tagTrend?.hideLoading()
      return { data: { xAxis: [], series: [] } }
    }),
  ]).then(([overview, trend, category, timeDistribution, words, tagStats, tagTrend]) => {
    // 更新概览数据
    overviewData.value = overviewData.value.map((item) => ({ ...item, loading: false }))
    overviewData.value[0].value = overview.data.total
    overviewData.value[1].value = overview.data.published
    overviewData.value[2].value = overview.data.draft
    overviewData.value[3].value = overview.data.tags

    // 设置各图表数据
    if (trend.data && trend.data.xAxis) setArticleTrendChart(trend.data)
    if (category.data) setCategoryPieChart(category.data)
    if (timeDistribution.data && timeDistribution.data.xAxis)
      setTimeDistributionChart(timeDistribution.data)
    if (words.data) setWordsDistributionChart(words.data)
    if (tagStats.data) setTagCloudChart(tagStats.data)
    if (tagTrend.data && tagTrend.data.xAxis) setTagTrendChart(tagTrend.data)
  })
}

/*监听窗口大小变化*/
const handleResize = () => {
  Object.values(charts).forEach((chart) => {
    chart?.resize()
  })
}
</script>

<template>
  <div class="p-[16px]">
    <!-- 数据概览卡片 -->
    <n-grid :cols="4" :x-gap="12" :y-gap="8">
      <n-grid-item v-for="item in overviewData" :key="item.label">
        <n-card :title="item.label" size="small">
          <n-skeleton v-if="item.loading" text :repeat="2" />
          <template v-else>
            <div class="text-[24px] font-bold color-#2d8cf0">{{ item.value }}</div>
            <div class="text-[14px] color-#999 mt-[4px]">{{ item.desc }}</div>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 图表区域 -->
    <n-grid :cols="2" :x-gap="12" :y-gap="12" class="mt-[4px]">
      <n-grid-item>
        <n-card title="文章发布趋势" size="small">
          <div ref="articleTrendRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="文章分类分布" size="small">
          <div ref="categoryPieRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="发布时间分布" size="small">
          <div ref="timeDistributionRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="文章字数分布" size="small">
          <div ref="wordsDistributionRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="热门标签" size="small">
          <div ref="tagCloudRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>

      <n-grid-item>
        <n-card title="标签使用趋势" size="small">
          <div ref="tagTrendRef" class="h-[300px] w-full"></div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped lang="scss"></style>
