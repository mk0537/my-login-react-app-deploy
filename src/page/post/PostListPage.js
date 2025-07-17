import React, { useEffect, useState } from "react";
import {
  fetchPosts,
  searchPostsByTitle,
  searchPostsByNickName,
} from "../../api/posts";
import PostItem from "../../components/PostItem";
import { useNavigate } from "react-router-dom";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("title"); // title | nickName | all

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 게시글 초기 로딩
  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch((err) => {
        console.error("게시글 불러오기 실패:", err);
      });
  }, []);

  // 검색 기능
  const onSearch = async () => {
    
    if (searchType !== "all" && !keyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      let result;
      if (searchType === "title") {
        result = await searchPostsByTitle(keyword);
        setPosts(result);
      } else if (searchType === "nickName") {
        result = await searchPostsByNickName(keyword);

        // 닉네임 검색 결과 오류 처리
        if (result.message) {
          alert(result.message); // 예: 회원 정보를 찾을 수 없습니다.
          setPosts([]);
          navigate("/"); 
          return;
        } else {
          setPosts(result);
        }
      } else if (searchType === "all") {
        const result = await fetchPosts();
        setPosts(result);
        setKeyword(""); // 검색어 입력창도 초기화
      }
    } catch (error) {
      console.error("게시글 검색 실패:", error);
      console.error("오류코드:", error.status);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  const handleWriteClick = () => {
    if (!token) {
      alert("로그인 후 글쓰기가 가능합니다.");
      navigate("/login");
      return;
    }
    navigate("/posts/write");
  };

  return (
    <div className="container2" style={{ position: "relative" }}>
      <div className="board-container">
        <div className="board-top">
          {/* 검색 타입 선택 */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ marginRight: "8px" }}
          >
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="nickName">닉네임</option>
          </select>

          <input
            type="text"
            placeholder="검색어 입력"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
          <button onClick={onSearch}>검색</button>
        </div>

        <div className="button-group2">
          <button className="postListPage-btn2" onClick={handleWriteClick}>
            글쓰기
          </button>
        </div>

        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PostListPage;
