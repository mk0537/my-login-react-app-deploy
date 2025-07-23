import axiosInstance from "./axiosInstance";

const BASE_URL = "/posts"; 

// 게시글 전체 조회
export const fetchPosts = () => {
  return axiosInstance.get(BASE_URL)
    .then(res => {
      console.log("게시글 목록:", res.data); // 닉네임 포함 데이터인지 확인
      return res.data.data; // res.data 구조에 따라 수정 필요
    });
};

// 게시글 ID로 조회
export const fetchPostById = (id) => {
  return axiosInstance.get(`${BASE_URL}/post/${id}`);
};

// 게시글 생성
export const createPost = async (postData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }
  // 토큰은 axiosInstance의 요청 인터셉터에서 자동 추가됨
  return axiosInstance.post(`${BASE_URL}/write`, postData);
};

// 게시글 수정
export const updatePost = async (id, postData) => {
  const token = localStorage.getItem("token")?.trim();
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  return axiosInstance.put(`${BASE_URL}/edit/${id}`, postData);
};

// 게시글 삭제
export const deletePost = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  return axiosInstance.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 제목 검색
export const searchPostsByTitle = (keyword) => {
  return axiosInstance.get(`${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`)
    .then(res => res.data);
};

// 닉네임 검색
export const searchPostsByNickName = (keyword) => {
  return axiosInstance.get(`${BASE_URL}/search/nick?keyword=${encodeURIComponent(keyword)}`)
    .then(res => res.data);
};

// 조회수 증가
export const increaseViewCount = async (postId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }
  return axiosInstance.put(`${BASE_URL}/post/${postId}/views`);
};

// 이미지 업로드
export const uploadImage = async (blob) => {
  const formData = new FormData();
  formData.append("image", blob);

  try {
    const res = await axiosInstance.post("/posts/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 서버가 준 상대 경로를 절대 경로로 변환해서 반환
    if (res.data?.imageUrl) {
      return `http://54.89.157.164:8080${res.data.imageUrl}`;
    }
    return null;
  } catch (error) {
    alert("이미지 업로드 실패");
    console.error(error);
    return null;
  }
};
