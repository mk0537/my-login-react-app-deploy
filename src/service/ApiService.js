import axios from 'axios';
import { API_BASE_URL } from "../api-config";

//api : 호출할 API의 경로 (예: /todos, /users)
//method: HTTP 메서드 (예: GET, POST, PUT, DELETE)
//request: 요청에 담을 데이터(주로 POST, PUT 요청에서 사용)
export function call(api, method, request) {
    // 기본 옵션 설정
    let options = {
        url: API_BASE_URL + api,
        method: method,
        headers: {//요청 헤더를 설정.
            "Content-Type": "application/json"
        },
        withCredentials: true,
    };

    // request가 존재하는 경우: POST, PUT, DELETE와 같은 GET 이외의 요청일 때, 요청 본문에 데이터를 담아 보낸다.
    if (request) {
        options.data = JSON.stringify(request); // 객체 형태로 전달된 데이터를 JSON 문자열로 변환하여 서버에 전송한다.
    }

    // axios(options): 앞서 설정한 options 객체를 사용하여 Axios로 HTTP 요청을 보낸다.
    return axios(options)
        //요청이 성공적으로 처리된 경우 실행되는 코드이다.
        .then(response => {
            //서버에서 반환된 실제 데이터를 반환하여, 이 데이터를 호출한 쪽에서 사용할 수 있도록 한다.
            console.log(response.data);
            return response.data;
        })
        //요청 중에 오류가 발생한 경우 실행되는 코드.
        .catch(error => {
            //에러가 발생하면, 이를 console.log로 출력하여 디버깅하거나 문제를 파악할 수 있도록 한다.
            const m_error = error;
            return m_error;
        });
}