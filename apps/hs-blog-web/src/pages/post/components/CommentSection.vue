<script setup lang="ts">
  import { createComment, deleteComment, getArticleComments } from '~/api/post'
  import type { CommentData, CreateCommentRequest } from '~/api/post/type'
  import { useUser } from '~/composables/useUser'
  import { HttpStatus } from '~/enums/httpStatus'
  import { TrashOutline, ChatboxEllipsesOutline } from '@vicons/ionicons5'
  import { renderIcon } from '~/utils/renderIcon'

  onMounted(() => {
    fetchComments()
  })

  /**
   * 回复状态
   */
  interface ReplyState {
    /**父评论ID（提交到后端的parentId）*/
    parentCommentId: number
    /**被回复用户名*/
    targetUserName: string
    /**是否回复的是评论（而非回复）*/
    isReplyingToComment: boolean
    /**目标ID（用于UI显示）*/
    targetId: number
    /**被回复内容的ID（用于数据关联）*/
    replyToId?: number
    /**被回复用户名（用于显示）*/
    replyToUser?: string
  }

  const props = defineProps<{
    articleId: number
    articleAuthorId: number
  }>()

  const { userInfo, token, showLoginModal } = useUser()
  const commentContent = ref('')
  const mainCommentContent = ref('')
  const replyState = ref<ReplyState | null>(null)
  const comments = ref<CommentData[]>([])
  const isSubmitting = ref(false)
  const loading = ref(true)
  const message = useMessage()

  /**
   * 评论列表
   * @description 结构化评论数据，将回复评论嵌套在父评论下
   */
  const structuredComments = computed(() => {
    /**顶级评论*/
    const topLevelComments = comments.value.filter(c => !c.parentId)

    // 将回复评论组织到对应的父评论下
    return topLevelComments.map(comment => {
      const replies = comments.value
        .filter(c => c.parentId === comment.id)
        // 回复也按照时间正序排列
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      return {
        ...comment,
        replies
      }
    })
  })

  /**
   * 判断某个评论是否处于回复状态
   * @param commentId 评论ID
   */
  const isReplying = (commentId: number) => {
    return replyState.value?.targetId === commentId
  }

  /**获取评论列表*/
  const fetchComments = async () => {
    loading.value = true
    try {
      const res = await getArticleComments(props.articleId)
      if (res.code === 200) {
        comments.value = res.data
      }
    } catch (error) {
      console.error('获取评论失败', error)
    } finally {
      loading.value = false
    }
  }

  /**提交主评论*/
  const submitComment = async () => {
    if (!token.value) {
      message.warning('请先登录后再发表评论')
      return
    }

    if (!mainCommentContent.value.trim()) {
      message.warning('评论内容不能为空')
      return
    }

    isSubmitting.value = true
    try {
      const params = {
        content: mainCommentContent.value,
        articleId: props.articleId
      }

      const res = await createComment(params)
      if (res.code === HttpStatus.OK) {
        message.success('评论发布成功')
        mainCommentContent.value = ''
        await fetchComments()
      }
    } catch (error) {
      console.error('发布评论失败', error)
      message.error('发布评论失败，请稍后重试')
    } finally {
      isSubmitting.value = false
    }
  }

  /**提交回复*/
  const submitReply = async () => {
    if (!token.value) {
      message.warning('请先登录后再回复评论')
      return
    }

    if (!commentContent.value.trim()) {
      message.warning('回复内容不能为空')
      return
    }

    if (!replyState.value) {
      message.warning('回复目标不存在')
      return
    }

    isSubmitting.value = true
    try {
      const params: CreateCommentRequest = {
        content: commentContent.value,
        articleId: props.articleId,
        parentId: replyState.value.parentCommentId
      }

      // 如果回复的是二级评论，添加关联信息
      if (!replyState.value.isReplyingToComment) {
        params.replyToId = replyState.value.targetId
        params.replyToUser = replyState.value.targetUserName
      }

      const res = await createComment(params)
      if (res.code === HttpStatus.OK) {
        message.success('回复发布成功')
        commentContent.value = ''
        replyState.value = null
        await fetchComments()
      }
    } catch (error) {
      console.error('发布回复失败', error)
      message.error('发布回复失败，请稍后重试')
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * 处理回复评论
   * @param comment 评论
   * @param isComment 是否是评论
   */
  const handleReply = (comment: CommentData, isComment = true) => {
    if (!token.value) {
      message.warning('请先登录后再回复评论')
      return
    }

    // 如果已经是回复此评论，则取消回复状态
    if (isReplying(comment.id)) {
      cancelReply()
      return
    }

    // 设置回复状态
    commentContent.value = ''
    replyState.value = {
      parentCommentId: isComment ? comment.id : (comment.parentId as number),
      targetUserName: comment.user.userName,
      isReplyingToComment: isComment,
      targetId: comment.id
    }
  }

  /**取消回复*/
  const cancelReply = () => {
    commentContent.value = ''
    replyState.value = null
  }

  /**
   * 删除评论
   * @param id 评论ID
   */
  const handleDeleteComment = async (id: number) => {
    if (!token.value) {
      return
    }

    const res = await deleteComment(id)
    if (res.code === HttpStatus.OK) {
      message.success(res.message)
    }
    await fetchComments()
  }

  /**
   * 判断当前登录用户是否是评论作者
   * @param comment 评论
   */
  const isCommentAuthor = (comment: CommentData) => {
    console.log(userInfo.value?.id,'userInfo.value?.id')
    return !!token.value && userInfo.value?.id === comment.userId
  }

  /**
   * 判断评论用户是否是文章作者
   * @param comment 评论
   */
  const isArticleAuthor = (comment: CommentData) => {
    return !!props.articleAuthorId && props.articleAuthorId === comment.userId
  }

  const getCommentOptions = (comment: CommentData) => {
    return [
      {
        show: isCommentAuthor(comment),
        label: '删除',
        key: 'delete',
        icon: renderIcon(TrashOutline),
        props: {
          onClick: () => {
            handleDeleteComment(comment.id)
          }
        }
      }
    ]
  }
</script>

<template>
  <div class="custom-border-1px-solid-#f0f0f0 p-[15px]">
    <h2 class="text-xl font-semibold mb-4">评论 {{ comments.length }}</h2>

    <!-- 主评论输入框 -->
    <div class="comment-input mb-6" id="comment-input">
      <n-input
        show-count
        clearable
        maxlength="1000"
        v-model:value="mainCommentContent"
        type="textarea"
        placeholder="平等表达，友善交流"
        :rows="4"
        :disabled="!token"
      />

      <div class="flex justify-between mt-2">
        <div v-if="!token" class="text-sm text-gray-500">
          请先
          <n-button text type="info" @click="showLoginModal">登录</n-button>
          后发表评论
        </div>

        <n-button
          type="primary"
          :loading="isSubmitting"
          :disabled="!token || !mainCommentContent.trim()"
          @click="submitComment"
        >
          发布评论
        </n-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <n-spin :show="loading">
        <template v-if="structuredComments.length > 0">
          <!-- 顶级评论 -->
          <div v-for="comment in structuredComments" :key="comment.id" class="comment-item mb-4">
            <div
              class="hover:border-[#e5e7eb] p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
            >
              <div class="flex items-start">
                <!-- 用户头像 -->
                <div class="flex-shrink-0 mr-3">
                  <n-avatar
                    :src="comment.user.avatar || '/img/default-avatar.png'"
                    fallback-src="/img/default-avatar.png"
                    round
                    size="medium"
                  />
                </div>

                <!-- 评论内容 -->
                <div class="flex-grow">
                  <div class="flex items-center">
                    <span class="font-semibold text-[15px]">{{ comment.user.userName }}</span>
                    <n-tag class="ml-2" :bordered="false" type="info" size="small" v-show="isArticleAuthor(comment)">
                      作者
                    </n-tag>
                  </div>

                  <div class="whitespace-pre-wrap break-words text-gray-800 mt-2">{{ comment.content }}</div>

                  <div class="flex mt-2 items-center justify-between">
                    <div class="flex items-center gap-x-[10px]">
                      <div class="text-xs text-gray-500 mr-[5px]">{{ formatRelativeTime(comment.createdAt) }}</div>

                      <n-button text color="#6B7280FF" size="tiny" @click="handleReply(comment)">
                        <template #icon>
                          <n-icon>
                            <ChatboxEllipsesOutline />
                          </n-icon>
                        </template>
                        <!-- 该条评论下的评论条数  -->
                        <span class="text-xs">{{ comment.replies.length > 0 ? comment.replies.length : '评论' }}</span>
                      </n-button>
                    </div>

                    <n-dropdown trigger="hover" :options="getCommentOptions(comment)">
                      <IconEllipsis class="cursor-pointer" />
                    </n-dropdown>
                  </div>
                </div>
              </div>
            </div>

            <!-- 回复评论框 - 顶级评论 -->
            <div
              v-if="isReplying(comment.id)"
              class="reply-box ml-10 mt-2 mb-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <n-input
                show-count
                clearable
                v-model:value="commentContent"
                type="textarea"
                maxlength="1000"
                placeholder="发表你的回复..."
                :rows="3"
                :disabled="isSubmitting"
              />

              <div class="flex justify-end mt-2">
                <n-button size="small" class="mr-2" @click="cancelReply">取消</n-button>
                <n-button
                  type="primary"
                  size="small"
                  :loading="isSubmitting"
                  :disabled="!commentContent.trim()"
                  @click="submitReply"
                >
                  发布回复
                </n-button>
              </div>
            </div>

            <!-- 二级评论/回复 -->
            <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies ml-10 mt-2">
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="reply-item py-3 px-4 mb-2 bg-gray-50 rounded-lg border-l-4 border-l-gray-200"
              >
                <div class="flex items-start">
                  <!-- 用户头像 -->
                  <div class="flex-shrink-0 mr-2">
                    <n-avatar
                      :src="reply.user.avatar || '/img/default-avatar.png'"
                      fallback-src="/img/default-avatar.png"
                      round
                      size="small"
                    />
                  </div>

                  <!-- 回复内容 -->
                  <div class="flex-grow">
                    <div class="flex items-center flex-wrap">
                      <span class="font-medium text-sm">{{ reply.user.userName }}</span>
                      <n-tag class="ml-2" :bordered="false" type="info" size="small" v-show="isArticleAuthor(reply)">
                        作者
                      </n-tag>
                      <!-- 根据replyToId字段判断是否显示"回复@谁" -->
                      <template v-if="reply.replyToId">
                        <span class="text-xs text-gray-400 mx-1">回复</span>
                        <span class="font-medium text-sm text-blue-500">{{ reply.replyToUser }}</span>
                      </template>
                    </div>

                    <div class="mt-1">
                      <p class="text-sm whitespace-pre-wrap break-words text-gray-700">{{ reply.content }}</p>
                    </div>

                    <div class="mt-2 flex justify-between">
                      <div class="flex items-center gap-x-[10px]">
                        <div class="text-xs text-gray-500 mr-[5px]">{{ formatRelativeTime(reply.createdAt) }}</div>

                        <n-button text color="#6B7280FF" size="tiny" @click="handleReply(reply, false)">
                          <template #icon>
                            <n-icon>
                              <ChatboxEllipsesOutline />
                            </n-icon>
                          </template>
                          <span class="text-xs">回复</span>
                        </n-button>
                      </div>

                      <n-dropdown trigger="hover" :options="getCommentOptions(reply)">
                        <IconEllipsis class="cursor-pointer" />
                      </n-dropdown>
                    </div>
                  </div>
                </div>

                <!-- 回复评论框 - 二级评论 -->
                <div v-if="isReplying(reply.id)" class="reply-box mt-2 p-3 bg-white rounded-lg border border-gray-200">
                  <n-input
                    show-count
                    clearable
                    v-model:value="commentContent"
                    type="textarea"
                    maxlength="1000"
                    :placeholder="`回复 ${replyState?.targetUserName}...`"
                    :rows="3"
                    :disabled="isSubmitting"
                  />

                  <div class="flex justify-end mt-2">
                    <n-button size="small" class="mr-2" @click="cancelReply">取消</n-button>
                    <n-button
                      type="primary"
                      size="small"
                      :loading="isSubmitting"
                      :disabled="!commentContent.trim()"
                      @click="submitReply"
                    >
                      发布回复
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <n-empty v-else description="暂无评论，快来发表第一条评论吧！" />
      </n-spin>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .comment-item {
    transition: all 0.3s ease;
  }

  .reply-item {
    transition: all 0.2s ease;

    &:hover {
      background-color: #f7f7f7;
      border-left-color: #d1d5db;
    }
  }

  .reply-box {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
