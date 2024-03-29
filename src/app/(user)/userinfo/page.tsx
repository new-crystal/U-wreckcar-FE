"use client"
import React, { useState } from "react"
import styles from "./userinfo.module.css"
import Image from "next/image"
import { myProfile } from "src/util/async/api"
import { useQuery } from "@tanstack/react-query"
import UserDelModal from "src/components/loginPage/UserDelModal"

interface UserProfile {
  username: string
  email: string
  age: number
  profile_img: any
  created_at: string
  // Add more properties as needed
}

export default function UserPage() {
  const [userData, setUserData] = useState<UserProfile | undefined>()
  const [modal, setModal] = useState(false)

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["userInfo"],
    queryFn: myProfile,
  })

  // const createDate = userData?.created_at.substring(0, 10)

  return (
    <>
      <section className={styles.user_container}>
        <div className={styles.title_box}>
          <h1>개인정보 관리</h1>
        </div>
        <article>
          <div className={styles.profile_img_box}>
            <Image
              className={styles.img}
              src={data?.data?.profile_img}
              alt=''
              width={180}
              height={180}
              unoptimized={true}
            />
            {/* <button>수정</button> */}
          </div>
          <div className={styles.item_box}>
            <div>이름</div>

            <span>{data?.data?.username}</span>
          </div>
          <div className={styles.item_box}>
            <div>이메일</div>
            <span>{data?.data?.email}</span>
          </div>
          {/* <div className={styles.item_box}>
          <div>연락처</div>
          <span>연락 API 있을까요?</span>
        </div>
        <button className={styles.edit_save}>변경사항 저장</button> */}
        </article>
        <div>
          <button
            className={styles.delete_button}
            onClick={() => setModal(true)}>
            회원탈퇴
          </button>
        </div>
        {modal && (
          <UserDelModal isOpen={modal} onRequestClose={() => setModal(false)} />
        )}
      </section>
    </>
  )
}
