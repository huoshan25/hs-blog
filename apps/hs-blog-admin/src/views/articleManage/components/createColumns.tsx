import {createDiscreteApi, type DataTableColumns, dateZhCN, NSpace, zhCN} from "naive-ui";
import {NButton, NIcon, NTag, NDatePicker, NConfigProvider } from "naive-ui";
import {ArticleStatus} from "@/api/article/type";
import {CloseSharp, Pencil, Reload, TrashSharp} from "@vicons/ionicons5";
import {updatedArticleReleaseTime} from "@/api/article";
import {HttpStatus} from "@/enums/httpStatus";
import type {Row} from "@/views/articleManage/index.vue";
import {useTimeFormat} from "@/utils/useTimeFormat.ts";

const { modal, message } = createDiscreteApi(['modal', 'message'])

type Methods = {
  handlePositiveClick: (id: number, status: ArticleStatus) => void;
  handleDeleteArticle: (id: number) => void;
  handleRecover: (id: number[]) => void;
  newArticle: (type: 'add' | 'edit', row?: Row) => void;
  getList: () => void;
}


/**
 * @description: 创建表格列
 * @param methods
 */
export const createColumns = (
  {handleDeleteArticle, handlePositiveClick, handleRecover, newArticle, getList}: Methods
): DataTableColumns<Row> => {

  const timestamp = ref()

  /*自定义发布时间弹窗*/
  const showUpdateReleaseTime = (row: Row) => {
    const m = modal.create({
      title: '自定义发布时间',
      preset: 'card',
      style: {
        width: '400px'
      },
      content() {
        /*提交修改发布时间*/
        const submitUpdateTime = async () => {
          const params = {
            id: row.id,
            publish_time: new Date(timestamp.value).toISOString()
          }
          const res = await updatedArticleReleaseTime(params)
          if(res.code === HttpStatus.OK) {
            message.success(res.message)
            getList()
            m.destroy()
          }
        }
        return <NSpace vertical>
          <NConfigProvider locale={zhCN} dateLocale={dateZhCN}>
            <NDatePicker
              value={timestamp.value}
              type="datetime"
              clearable
              onUpdateValue={(value) => {
                timestamp.value = value
              }}
            />
          </NConfigProvider>
          <div class={'flex justify-end mt10'}>
            <NButton onClick={() => submitUpdateTime()}>
              确定
            </NButton>
          </div>
        </NSpace>
       },
      onClose: () => {
        console.log('Modal closed')
      }
    })
  }

  const columnsConfig = [
    {
      type: 'selection',
      show: true,
      align: 'center'
    },

    {
      title: '状态',
      key: 'status',
      width: 80,
      show: true,
      align: 'center',
      render(row: Row) {
        switch (row.status) {
          case ArticleStatus.PUBLISH:
            return <NTag type="info">发布</NTag>;
          case ArticleStatus.DRAFT:
            return <NTag type="warning">草稿</NTag>;
          case ArticleStatus.DELETE:
            return <NTag type="error">删除</NTag>;
        }
      }
    },

    {
      title: '分类',
      width: 160,
      key: 'category_name',
      show: true,
      ellipsis: {
        tooltip: true
      },
      align: 'center'
    },

    {
      title: '标题',
      key: 'title',
      show: true,
      align: 'left',
      minWidth: 350,
      ellipsis: {
        tooltip: true
      }
    },

    {
      title: '创建时间',
      key: 'create_time',
      width: 170,
      show: true,
      align: 'center',
      render(row: Row) {
        return useTimeFormat(row.create_time)
      }
    },

    {
      title: '修改时间',
      key: 'update_time',
      width: 170,
      show: true,
      align: 'center',
      render(row: Row) {
        return useTimeFormat(row.update_time)
      }
    },

    {
      title: '发布时间',
      key: 'publish_time',
      width: 170,
      show: true,
      align: 'center',
      render(row: Row) {
        return (
          <>
            <div v-show={row.status === ArticleStatus.PUBLISH }>
              <p>{row.publish_time ? useTimeFormat(row.publish_time) : '--'}</p>
              <div onClick={() => showUpdateReleaseTime(row) }>
                <NIcon class={'cursor-pointer'} size="19">
                  <Pencil/>
                </NIcon>
              </div>
            </div>
            <div v-show={row.status !== ArticleStatus.PUBLISH }>--</div>
          </>
        )
      }
    },

    {
      title: '操作',
      key: 'controls',
      show: true,
      align: 'center',
      render(row: Row) {
        /**是否删除*/
        const isDelete = row.status === ArticleStatus.DELETE;
        return <>
          <NButton size="small" class="mr10" onClick={() => {
            if (isDelete) {
              handleRecover([row.id]);
            } else {
              newArticle('edit', row);
            }
          }}>
            <NIcon size="19">
              {isDelete? <Reload/> : <Pencil/>}
            </NIcon>
          </NButton>
          <NButton size="small" onClick={() => {
            if (isDelete) {
              handleDeleteArticle(row.id);
            } else {
              handlePositiveClick(row.id, ArticleStatus.DELETE);
            }
          }}>
            <NIcon size="19">
              {isDelete ? <TrashSharp/> : <CloseSharp/>}
            </NIcon>
          </NButton>
        </>
      }
    },

  ]
  return columnsConfig.filter(item => item.show) as DataTableColumns<Row>
}