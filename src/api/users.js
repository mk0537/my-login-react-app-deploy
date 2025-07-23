import axiosInstance from "./axiosInstance";

const BASE_URL = "/login";

// 로그인 (자동 로그인용)
export const signin = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/signin`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response;
    } else {
      throw error;
    }
  }
};

// 닉네임 중복 확인
export const checkNickname = async (nickname) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/auth/check-nickname`, {
      params: { nickname },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

// 이메일 중복 확인
export const checkEmail = async (email) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/auth/check-email`, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

// 회원가입
export const signup = async ({ email, password, name, nickName }) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/signup`, {
      email,
      password,
      name,
      nickName,
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

// 이메일 찾기
export const findEmail = async ({ name, password }) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/find-email`, {
      name,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

// 유저 정보 조회
export const getUserInfo = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/user`);
  return response.data;
};

// 유저 탈퇴
export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`${BASE_URL}/user?id=${userId}`);
  return response.data;
};

// 임시 비밀번호 발급
export const issueTempPassword = async ({ email }) => {
  const response = await axiosInstance.post(
    `${BASE_URL}/temp-password`,
    { email },
    { responseType: "text" }
  );
  return response.data;
};

// 회원 정보 수정
export const updateUserProfile = async (id, data) => {
  const response = await axiosInstance.put(`${BASE_URL}/edit-profile?id=${id}`, data);
  return response.data;
};

// 현재 비밀번호 확인
export const confirmCurrentPassword = async (currentPassword) => {
  const response = await axiosInstance.put(`${BASE_URL}/change-password`, {
    currentPassword,
    newPassword: currentPassword, // 확인만 하는 요청
  });
  return response.data;
};

// 비밀번호 변경
export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.put(`${BASE_URL}/change-password`, {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// 이메일로 회원 정보 조회
export const getUserByEmail = async (email) => {
  const response = await axiosInstance.get(`${BASE_URL}/user/email`, {
    params: { email },
  });
  return response.data;
};
