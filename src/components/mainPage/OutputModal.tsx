import Image from "next/image"
import styles from "./main.module.css"

import not_sheet from "public/assets/sheet.png"
import not_excel from "public/assets/execel.png"

import active_sheet from "public/assets/blue_sheet.png"
import active_excel from "public/assets/blue_excel.png"

import b_close from "public/assets/b_close.png"
import { useEffect, useState } from "react"

import Axios from "src/util/async/axiosConfig"
import { Alert, AlertTitle, CircularProgress } from "@mui/material"
import Modal from "src/util/type/Modal"

import { BlueButton } from "src/shared/button/BlueButton"

type OutputModalType = {
  isOpen: boolean
  onRequestClose: any
  style: any
  dataList: any
}
export const OutputModal: React.FC<OutputModalType> = ({
  isOpen,
  onRequestClose,
  style,
  dataList,
}) => {
  const [sheet, setSheet] = useState(false)
  const [excel, setExcel] = useState(false)
  const [alert, setAlert] = useState(false)
  const [loading, setLoading] = useState(false)

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["output/excel"],
  //   queryFn: getData,
  // })

  // async function getData() {
  //   const res = await Axios.post(
  //     `utms/toxlsx`,
  //     { data: dataList },
  //     { responseType: "blob" }
  //   )
  //   return res
  // }

  async function onClickPopHandler() {
    if (excel) {
      try {
        setLoading(true)
        const response = await Axios.post(
          "utms/toxlsx",
          { data: dataList },
          {
            responseType: "blob",
          }
        )
        // const response = await getData()
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const a = document.createElement("a")
        a.href = url
        const timestamp = new Date(Date.now()).toISOString().slice(0, 10)
        a.download = `${timestamp}.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)
        onRequestClose()
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setAlert(true)
        console.error("download error", error)
      }
    }

    if (sheet) {
      try {
        setLoading(true)
        const response = await Axios.post("utms/export/sheet/csv", dataList, {
          responseType: "blob",
        })
        // const response = await getData("export/sheet/csv")
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const a = document.createElement("a")
        a.href = url
        const timestamp = new Date(Date.now()).toISOString().slice(0, 10)
        a.download = `${timestamp}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        onRequestClose()
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setAlert(true)
        console.error("download error", error)
      }
    }
  }

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false)
      }, 3000)
    }
  }, [alert])

  useEffect(() => {
    if (excel) {
      setSheet(false)
    }
    if (sheet) {
      setExcel(false)
    }
  }, [excel, sheet])

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={style}>
      <div
        className={styles.dialogBox}
        {...(isOpen && true ? { open: true } : {})}
        id='favDialog'>
        <div className={styles.header}>
          <div className={styles.title_box_out}>
            <span className={styles.title}>UTM 추출하기</span>
          </div>
          <div className={styles.cancleBtn_box}>
            <button className={styles.cancleBtn} onClick={onRequestClose}>
              <Image src={b_close} alt='close_img' width={24} height={24} />
            </button>
          </div>
        </div>
        <div className={styles.contents}>
          <div className={styles.col_box}>
            <div>
              <p>{dataList?.length}개의 UTM이 선택되었습니다.</p>
              <p>UTM 데이터를 보낼 툴을 선택해주세요</p>
              {sheet && (
                <span className={styles.noti_span}>
                  다운로드 되는 csv 파일을 스프레드시트로 열어 주세요
                </span>
              )}
            </div>
            <div className={styles.img_box}>
              <div className={styles.img_box_img}>
                {sheet ? (
                  <Image
                    width={150}
                    height={100}
                    alt='outputmodal'
                    src={active_sheet}
                    onClick={() => setSheet(!sheet)}
                  />
                ) : (
                  <Image
                    width={150}
                    height={100}
                    alt='outputmodal'
                    src={not_sheet}
                    onClick={() => setSheet(!sheet)}
                  />
                )}
              </div>

              <div
                onClick={() => setExcel(true)}
                className={styles.img_box_img}>
                {excel ? (
                  <Image
                    width={150}
                    height={100}
                    alt='outputmodal'
                    src={active_excel}
                  />
                ) : (
                  <Image
                    width={150}
                    height={100}
                    alt='outputmodal'
                    src={not_excel}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {alert && (
          <Alert severity='warning'>
            <AlertTitle>Warning</AlertTitle>
            <strong>추출을 실패했습니다!</strong>
            다시 시도해주세요
          </Alert>
        )}
        <div className={styles.bottom}>
          {loading ? (
            <button className={styles.modal_button_loading} value='default'>
              <CircularProgress disableShrink size={15} />
            </button>
          ) : (
            // <button
            //   onClick={onClickPopHandler}
            //   className={styles.modal_button}
            //   value="default"
            // >
            //   추출하기
            // </button>
            <BlueButton
              text={"추출하기"}
              x={84}
              y={38}
              confirmFN={onClickPopHandler}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
